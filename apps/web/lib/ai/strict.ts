
import { z } from 'zod';

export const SeeTaskZ = z.object({
  id: z.string(),
  type: z.enum(['alert','order','note']),
  desc: z.string(),
  priority: z.enum(['low','medium','high']),
  trigger: z.any().optional(),
  order: z.any().optional()
});

export const SeePlanZ = z.object({
  symbol: z.string(),
  regime: z.object({
    trend: z.enum(['up','down','range']),
    vol: z.enum(['low','normal','high']),
    bias: z.string()
  }),
  levels: z.array(z.object({ type: z.string(), price: z.number() })),
  tasks: z.array(SeeTaskZ).min(1),
  reason: z.string().optional()
});

export const RiskCritiqueZ = z.object({
  summary: z.string(),
  flags: z.array(z.object({
    id: z.string(),
    severity: z.enum(['info','warn','block']),
    message: z.string()
  })),
  adjust: z.array(z.object({
    id: z.string(),
    to: z.number(),
    why: z.string()
  }))
});

export type SeePlan = z.infer<typeof SeePlanZ>;
export type RiskCritique = z.infer<typeof RiskCritiqueZ>;

export function extractJson(text: string): string | null {
  if (!text) return null;
  // 1) fenced code blocks
  const codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeMatch) return codeMatch[1];
  // 2) first balanced JSON-like object or array
  const start = Math.min(...[text.indexOf('{'), text.indexOf('[')].filter(i => i >= 0));
  if (start < 0) return null;
  let level = 0; let end = -1;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === '{' || c === '[') level++;
    else if (c === '}' || c === ']') {
      level--;
      if (level === 0) { end = i + 1; break; }
    }
  }
  if (end > start) return text.slice(start, end);
  return null;
}

export function tryParseJSON(text: string): any | null {
  try { return JSON.parse(text); } catch { return null; }
}

export function validateOrThrow<T>(schema: z.ZodSchema<T>, value: any, hint: string){
  const r = schema.safeParse(value);
  if (!r.success) {
    const issues = r.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid ${hint}: ${issues}`);
  }
  return r.data;
}

export function coerceNumberFields(plan: any){
  // best-effort numeric coercion for levels.price
  if (Array.isArray(plan?.levels)) {
    plan.levels = plan.levels.map((l:any) => ({ ...l, price: Number(l.price) }));
  }
  return plan;
}
