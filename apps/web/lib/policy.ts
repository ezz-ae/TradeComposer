
import type { RiskCritique } from '@/app/lib/ai/strict';

export type RailsState = { slipCapBps: number; killGapBps: number };
export type GateDecision = {
  blockForce: boolean;
  reasons: string[];
  warnings: string[];
  info: string[];
};

export function evaluateGate(rails: RailsState, critique?: RiskCritique | null): GateDecision {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  // Rails
  if (rails.slipCapBps > 12) reasons.push(`Rails: slipCap ${rails.slipCapBps}bps > 12bps`);
  if (rails.killGapBps > 30) reasons.push(`Rails: killGap ${rails.killGapBps}bps > 30bps`);

  // AI critique flags
  if (critique?.flags?.length) {
    critique.flags.forEach(f => {
      if (f.severity === 'block') reasons.push(`AI: ${f.message}`);
      else if (f.severity === 'warn') warnings.push(`AI: ${f.message}`);
      else info.push(`AI: ${f.message}`);
    });
  }

  return {
    blockForce: reasons.length > 0,
    reasons, warnings, info
  };
}
