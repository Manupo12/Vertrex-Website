"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LLMResponse = {
  content: string;
  tokensUsed: number;
  model: string;
  finishReason: string;
};

export async function generateChatCompletion(
  messages: LLMMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<LLMResponse | null> {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: options?.model || "gpt-4o-mini",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    });

    const choice = response.choices[0];
    if (!choice?.message?.content) {
      return null;
    }

    return {
      content: choice.message.content,
      tokensUsed: response.usage?.total_tokens || 0,
      model: response.model,
      finishReason: choice.finish_reason || "stop",
    };
  } catch (error) {
    console.error("LLM Error:", error);
    return null;
  }
}

export async function generateSummary(
  text: string,
  maxLength?: number
): Promise<string | null> {
  const response = await generateChatCompletion([
    {
      role: "system",
      content: `Resuma el siguiente texto en ${maxLength || 3} puntos clave concisos.`,
    },
    { role: "user", content: text },
  ],
  { temperature: 0.3, maxTokens: 500 }
  );

  return response?.content || null;
}

export async function classifyContent(
  text: string,
  categories: string[]
): Promise<string | null> {
  const response = await generateChatCompletion([
    {
      role: "system",
      content: `Clasifica el siguiente texto en una de estas categorías: ${categories.join(", ")}. Responde solo con el nombre de la categoría.`,
    },
    { role: "user", content: text },
  ],
  { temperature: 0.2, maxTokens: 50 }
  );

  return response?.content?.trim() || null;
}
