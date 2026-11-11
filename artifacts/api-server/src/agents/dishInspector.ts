import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogle } from "@langchain/google/node";
import { z } from "zod";
import { cityDishInspectorRules } from "../city";

const dishInspectionSchema = z.object({
  isMatch: z.boolean().describe("Whether the image clearly depicts kitfo."),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence that the image depicts kitfo, from 0 to 1."),
  whatISee: z
    .string()
    .min(1)
    .max(300)
    .describe("A brief, neutral description of the visible food or uncertainty."),
});

export type DishInspection = z.infer<typeof dishInspectionSchema>;

export async function inspectDishImage(
  mimeType: string,
  imageBase64: string,
): Promise<DishInspection> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const inspector = new ChatGoogle({
    apiKey,
    model,
    temperature: 0,
    maxRetries: 1,
  }).withStructuredOutput(dishInspectionSchema);

  return inspector.invoke([
    new SystemMessage(cityDishInspectorRules),
    new HumanMessage([
      {
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${imageBase64}` },
      },
    ]),
  ]);
}
