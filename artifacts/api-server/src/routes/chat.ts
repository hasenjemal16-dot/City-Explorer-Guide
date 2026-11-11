import { GoogleGenAI, type Content } from "@google/genai";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { citySystemPrompt } from "../city";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const DEFAULT_SETTINGS = {
  temperature: 1,
  topP: 0.95,
  maxOutputTokens: 300,
};
const DEFAULT_MODEL = "gemini-2.5-flash";

const messageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(4000),
  })
  .strict();

const chatRequestSchema = z
  .object({
    message: z.string().trim().min(1, "Enter a question for the city guide.").max(4000),
    history: z.array(messageSchema).max(20).optional(),
    settings: z
      .object({
        temperature: z.number().min(0).max(2).optional(),
        topP: z.number().min(0).max(1).optional(),
        maxOutputTokens: z.number().int().min(32).max(1024).optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

router.get("/chat/system-prompt", (_req, res) => {
  res.json({ systemPrompt: citySystemPrompt });
});

router.post("/chat", async (req, res) => {
  const parsedBody = chatRequestSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({
      error:
        parsedBody.error.issues[0]?.message ??
        "Check your question and settings, then try again.",
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "The city guide is not configured yet. Add a GEMINI_API_KEY secret, then try again.",
    });
    return;
  }

  const settings = { ...DEFAULT_SETTINGS, ...parsedBody.data.settings };
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const ai = new GoogleGenAI({ apiKey });

  try {
    const contents: Content[] = (parsedBody.data.history ?? []).map(
      (item): Content => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }],
      }),
    );
    contents.push({ role: "user", parts: [{ text: parsedBody.data.message }] });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: citySystemPrompt,
        ...settings,
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      res.status(502).json({
        error: "The city guide could not form an answer. Please try asking a shorter question.",
      });
      return;
    }

    const finishReason = response.candidates?.[0]?.finishReason;
    const usage = {
      promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
      candidateTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
      truncated: finishReason === "MAX_TOKENS",
    };

    res.json({ reply, usage, settings, model });
  } catch (error) {
    logger.error(
      { errorName: error instanceof Error ? error.name : "UnknownError" },
      "Gemini request failed",
    );
    res.status(502).json({
      error: "The city guide could not connect to its AI service. Please try again shortly.",
    });
  }
});

export default router;
