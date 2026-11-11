import { Router, type IRouter } from "express";
import { db, dishPhotosTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { inspectDishImage } from "../agents/dishInspector";
import { citySettings } from "../city";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_BASE64_LENGTH = 4 * Math.ceil(MAX_IMAGE_BYTES / 3);
const IMAGE_DATA_URL_PATTERN =
  /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/i;
const MAX_DATA_URL_LENGTH = MAX_BASE64_LENGTH + 40;
const createDishSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Enter a dish title.")
      .max(120, "Keep the dish title under 120 characters."),
    caption: z
      .string()
      .trim()
      .max(500, "Keep the caption under 500 characters.")
      .optional(),
    image: z
      .string()
      .max(MAX_DATA_URL_LENGTH, "Choose an image no larger than 3 MB.")
      .regex(
        IMAGE_DATA_URL_PATTERN,
        "Choose a valid JPEG, PNG, or WebP image.",
      ),
  })
  .strict();

function hasExpectedImageSignature(mimeType: string, image: Buffer): boolean {
  if (mimeType === "image/jpeg") {
    return image.length >= 3 && image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
  }

  if (mimeType === "image/png") {
    return image.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  }

  return (
    mimeType === "image/webp" &&
    image.length >= 12 &&
    image.toString("ascii", 0, 4) === "RIFF" &&
    image.toString("ascii", 8, 12) === "WEBP"
  );
}

router.get("/dishes", async (_req, res) => {
  const dishes = await db
    .select({
      id: dishPhotosTable.id,
      title: dishPhotosTable.title,
      caption: dishPhotosTable.caption,
      mimeType: dishPhotosTable.mimeType,
      inspectorNote: dishPhotosTable.inspectorNote,
      createdAt: dishPhotosTable.createdAt,
    })
    .from(dishPhotosTable)
    .orderBy(desc(dishPhotosTable.createdAt), desc(dishPhotosTable.id));

  res.json(
    dishes.map((dish) => ({
      ...dish,
      imageUrl: `/api/dishes/${dish.id}/image`,
    })),
  );
});

router.post("/dishes", async (req, res) => {
  const parsedBody = createDishSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      error:
        parsedBody.error.issues[0]?.message ??
        "Check the dish title, caption, and image, then try again.",
    });
    return;
  }

  const { title, caption, image } = parsedBody.data;
  const match = IMAGE_DATA_URL_PATTERN.exec(image);
  if (!match) {
    res.status(400).json({ error: "Choose a valid JPEG, PNG, or WebP image." });
    return;
  }

  const mimeType = match[1].toLowerCase();
  const imageBase64 = match[2];
  if (imageBase64.length > MAX_BASE64_LENGTH) {
    res.status(413).json({ error: "Image must be no larger than 3 MB." });
    return;
  }

  const imageBytes = Buffer.from(imageBase64, "base64");
  if (
    imageBytes.length === 0 ||
    imageBytes.length > MAX_IMAGE_BYTES ||
    imageBytes.toString("base64") !== imageBase64
  ) {
    res.status(imageBytes.length > MAX_IMAGE_BYTES ? 413 : 400).json({
      error:
        imageBytes.length > MAX_IMAGE_BYTES
          ? "Image must be no larger than 3 MB."
          : "Image data is not valid base64.",
    });
    return;
  }

  if (!hasExpectedImageSignature(mimeType, imageBytes)) {
    res.status(400).json({
      error: "Image contents do not match the selected image format.",
    });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(502).json({
      error: "Photo inspection is not configured. Add a GEMINI_API_KEY secret, then try again.",
    });
    return;
  }

  let inspection;
  try {
    inspection = await inspectDishImage(mimeType, imageBase64);
  } catch (error) {
    logger.error(
      { errorName: error instanceof Error ? error.name : "UnknownError" },
      "Dish image inspection failed",
    );
    res.status(502).json({
      error: "The dish inspector is unavailable. Please try uploading your photo again shortly.",
    });
    return;
  }

  if (!inspection.isMatch || inspection.confidence < 0.7) {
    res.status(422).json({
      error: `Only ${citySettings.favoriteDish} photos can be uploaded!`,
      reason: `The inspector saw: ${inspection.whatISee} Please choose a clear ${citySettings.favoriteDish} photo and try again.`,
    });
    return;
  }

  const inspectorNote = `Inspector: looks like ${citySettings.favoriteDish} (${Math.round(inspection.confidence * 100)}% sure)`;
  const [dish] = await db
    .insert(dishPhotosTable)
    .values({
      title: title.trim(),
      caption: caption?.trim() ?? "",
      mimeType,
      imageBase64,
      inspectorNote,
    })
    .returning({
      id: dishPhotosTable.id,
      title: dishPhotosTable.title,
      caption: dishPhotosTable.caption,
      mimeType: dishPhotosTable.mimeType,
      inspectorNote: dishPhotosTable.inspectorNote,
      createdAt: dishPhotosTable.createdAt,
    });

  res.status(201).json({
    ...dish,
    imageUrl: `/api/dishes/${dish.id}/image`,
  });
});

router.get("/dishes/:id/image", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(404).json({ error: "Dish photo not found." });
    return;
  }

  const [dish] = await db
    .select({
      mimeType: dishPhotosTable.mimeType,
      imageBase64: dishPhotosTable.imageBase64,
    })
    .from(dishPhotosTable)
    .where(eq(dishPhotosTable.id, id))
    .limit(1);

  if (!dish) {
    res.status(404).json({ error: "Dish photo not found." });
    return;
  }

  res.type(dish.mimeType).send(Buffer.from(dish.imageBase64, "base64"));
});

export default router;
