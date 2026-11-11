import { Router, type IRouter } from "express";
import { z } from "zod";
import { citySettings } from "../city";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const UNSPLASH_API = "https://api.unsplash.com";
const UNSPLASH_ATTRIBUTION_SOURCE = "city-explorer-guide";
const UNSPLASH_HEADERS = { "Accept-Version": "v1" };

const unsplashPhotoSchema = z.object({
  id: z.string().min(1),
  urls: z.object({
    regular: z.string().url(),
    raw: z.string().url(),
  }),
  alt_description: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  user: z.object({
    name: z.string().min(1),
    links: z.object({
      html: z.string().url(),
    }),
  }),
  links: z.object({
    download_location: z.string().url(),
  }),
});

const unsplashSearchSchema = z.object({
  results: z.array(unsplashPhotoSchema),
});

const unsplashPhotoDetailsSchema = z.object({
  links: z.object({
    download_location: z.string().url(),
  }),
});

function trackedAttributionUrl(value: string): string {
  const url = new URL(value);
  url.searchParams.set("utm_source", UNSPLASH_ATTRIBUTION_SOURCE);
  url.searchParams.set("utm_medium", "referral");
  return url.toString();
}

function accessKey(): string | null {
  return process.env.UNSPLASH_ACCESS_KEY?.trim() || null;
}

router.get("/unsplash/dish-inspiration", async (_req, res) => {
  const key = accessKey();
  if (!key) {
    res.status(503).json({
      error: "Food inspiration is not configured. Add an UNSPLASH_ACCESS_KEY secret, then try again.",
    });
    return;
  }

  const query = `${citySettings.favoriteDish} ${citySettings.city}`;
  const searchUrl = new URL(`${UNSPLASH_API}/search/photos`);
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("per_page", "6");
  searchUrl.searchParams.set("orientation", "landscape");

  try {
    const response = await fetch(searchUrl, {
      headers: {
        ...UNSPLASH_HEADERS,
        Authorization: `Client-ID ${key}`,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, "Unsplash photo search failed");
      res.status(502).json({
        error: "Food inspiration could not load right now. Please try refreshing in a moment.",
      });
      return;
    }

    const parsed = unsplashSearchSchema.safeParse(await response.json());
    if (!parsed.success) {
      logger.warn("Unsplash returned an unexpected photo search response");
      res.status(502).json({
        error: "Food inspiration returned an unexpected response. Please try refreshing in a moment.",
      });
      return;
    }

    res.json(
      parsed.data.results.slice(0, 6).map((photo) => ({
        id: photo.id,
        imageUrl: photo.urls.regular,
        rawUrl: photo.urls.raw,
        altText:
          photo.alt_description?.trim() ||
          photo.description?.trim() ||
          `Food inspiration photo by ${photo.user.name}`,
        photographerName: photo.user.name,
        photographerProfileUrl: trackedAttributionUrl(photo.user.links.html),
        downloadLocation: photo.links.download_location,
      })),
    );
  } catch (error) {
    logger.warn(
      { errorName: error instanceof Error ? error.name : "UnknownError" },
      "Unsplash photo search request failed",
    );
    res.status(502).json({
      error: "Food inspiration could not load right now. Please check your connection and try again.",
    });
  }
});

router.post("/unsplash/photos/:id/download", async (req, res) => {
  const parsedId = z.string().regex(/^[A-Za-z0-9_-]{1,100}$/).safeParse(req.params.id);
  if (!parsedId.success) {
    res.status(400).json({ error: "That inspiration photo could not be identified. Please refresh the grid." });
    return;
  }

  const key = accessKey();
  if (!key) {
    res.status(503).json({
      error: "Food inspiration is not configured. Add an UNSPLASH_ACCESS_KEY secret, then try again.",
    });
    return;
  }

  const headers = {
    ...UNSPLASH_HEADERS,
    Authorization: `Client-ID ${key}`,
  };

  try {
    const detailsResponse = await fetch(
      `${UNSPLASH_API}/photos/${encodeURIComponent(parsedId.data)}`,
      { headers, signal: AbortSignal.timeout(10_000) },
    );
    if (!detailsResponse.ok) {
      logger.warn({ status: detailsResponse.status }, "Unsplash photo lookup failed");
      res.status(502).json({
        error: "This photo could not be opened right now. Please try again in a moment.",
      });
      return;
    }

    const details = unsplashPhotoDetailsSchema.safeParse(await detailsResponse.json());
    if (!details.success) {
      res.status(502).json({
        error: "This photo could not be opened right now. Please refresh the inspiration grid.",
      });
      return;
    }

    const downloadLocation = new URL(details.data.links.download_location);
    if (
      downloadLocation.origin !== UNSPLASH_API ||
      downloadLocation.pathname !== `/photos/${parsedId.data}/download`
    ) {
      logger.warn("Unsplash returned an invalid download tracking URL");
      res.status(502).json({
        error: "This photo could not be opened right now. Please refresh the inspiration grid.",
      });
      return;
    }

    const trackingResponse = await fetch(downloadLocation, {
      headers,
      signal: AbortSignal.timeout(10_000),
    });
    if (!trackingResponse.ok) {
      logger.warn({ status: trackingResponse.status }, "Unsplash download tracking failed");
      res.status(502).json({
        error: "This photo could not be opened right now. Please try again in a moment.",
      });
      return;
    }

    await trackingResponse.body?.cancel();
    res.status(204).end();
  } catch (error) {
    logger.warn(
      { errorName: error instanceof Error ? error.name : "UnknownError" },
      "Unsplash download tracking request failed",
    );
    res.status(502).json({
      error: "This photo could not be opened right now. Please check your connection and try again.",
    });
  }
});

export default router;
