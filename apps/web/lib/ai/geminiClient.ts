
import type { RequestInit } from 'next/dist/server/web/spec-extension/request';
let _client: any = null;

type GeminiConfig = {
  apiKey?: string
  model?: string
};

export function getGemini(): { enabled: boolean; model: string; generate: (prompt: string) => Promise<string> } {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  if (!apiKey) {
    // Safe mock fallback
    return {
      enabled: false,
      model,
      async generate(prompt: string) {
        return `[MOCK:${model}] ` + prompt.slice(0, 90) + ' ...';
      }
    };
  }
  try {
    // Lazy import to keep edge bundles small
    // @ts-ignore
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelClient = genAI.getGenerativeModel({ model });
    _client = modelClient;
    return {
      enabled: true,
      model,
      async generate(prompt: string) {
        const r = await modelClient.generateContent(prompt);
        const out = r?.response?.text?.() ?? r?.response?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text).join('') ?? '';
        return out || '';
      }
    };
  } catch (e) {
    return {
      enabled: false,
      model,
      async generate(prompt: string) {
        return `[MOCK:${model}] ` + prompt.slice(0, 90) + ' ...';
      }
    };
  }
}
