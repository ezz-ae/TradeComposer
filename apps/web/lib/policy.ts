
import type { RiskCritique } from '@/app/lib/ai/strict';
import { currentThresholds } from '@/app/lib/policyPresets';

export type RailsState = { slipCapBps: number; killGapBps: number };
export type GateDecision = {
  blockForce: boolean;
  reasons: string[];
  warnings: string[];
  info: string[];
  thresholds: { slipCapMaxBps: number; killGapMaxBps: number };
};

export function evaluateGate(rails: RailsState, critique?: RiskCritique | null): GateDecision {
  const t = currentThresholds();
  const reasons: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];

  if (rails.slipCapBps > t.slipCapMaxBps) reasons.push(`Rails: slipCap ${rails.slipCapBps}bps > ${t.slipCapMaxBps}bps`);
  if (rails.killGapBps > t.killGapMaxBps) reasons.push(`Rails: killGap ${rails.killGapBps}bps > ${t.killGapMaxBps}bps`);

  if (critique?.flags?.length) {
    critique.flags.forEach(f => {
      if (f.severity === 'block') reasons.push(`AI: ${f.message}`);
      else if (f.severity === 'warn') warnings.push(`AI: ${f.message}`);
      else info.push(`AI: ${f.message}`);
    });
  }

  return {
    blockForce: reasons.length > 0,
    reasons, warnings, info,
    thresholds: t
  };
}
