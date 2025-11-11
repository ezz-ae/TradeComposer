
const KEY = 'tc.policy.presets.v1';

export type GateThresholds = {
  slipCapMaxBps: number;     // > blocks Force
  killGapMaxBps: number;     // > blocks Force
};

export type GatePreset = {
  id: string;
  name: string;
  thresholds: GateThresholds;
  notes?: string;
};

export type GateConfig = {
  activePresetId: string;
  presets: GatePreset[];
};

export const DEFAULT_PRESETS: GatePreset[] = [
  { id: 'safe', name: 'Safe', thresholds: { slipCapMaxBps: 8,  killGapMaxBps: 20 }, notes: 'Loss-minimizing default' },
  { id: 'balanced', name: 'Balanced', thresholds: { slipCapMaxBps: 12, killGapMaxBps: 30 }, notes: 'Project standard' },
  { id: 'aggressive', name: 'Aggressive', thresholds: { slipCapMaxBps: 18, killGapMaxBps: 45 }, notes: 'Expert only' }
];

export function loadGateConfig(): GateConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { activePresetId: 'balanced', presets: DEFAULT_PRESETS };
    const cfg = JSON.parse(raw);
    if (!Array.isArray(cfg?.presets)) return { activePresetId: 'balanced', presets: DEFAULT_PRESETS };
    return { activePresetId: cfg.activePresetId || 'balanced', presets: cfg.presets };
  } catch {
    return { activePresetId: 'balanced', presets: DEFAULT_PRESETS };
  }
}

export function saveGateConfig(cfg: GateConfig){
  localStorage.setItem(KEY, JSON.stringify(cfg));
}

export function currentThresholds(): GateThresholds {
  const cfg = loadGateConfig();
  const p = cfg.presets.find(p => p.id === cfg.activePresetId) || cfg.presets[0];
  return p.thresholds;
}
