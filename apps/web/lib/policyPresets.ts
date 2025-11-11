
/**
 * Org + User + Session policy presets with locks.
 * Storage:
 *  - ORG:     tc.policy.org.v1
 *  - USER:    tc.policy.presets.v1            (legacy user-level presets)
 *  - SESSION: tc.policy.session.<sid>.v1
 */

export type GateThresholds = {
  slipCapMaxBps: number;
  killGapMaxBps: number;
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

export type OrgLocks = {
  slipCapMaxBps?: boolean;   // true = locked at org preset value
  killGapMaxBps?: boolean;
};

export type OrgPolicy = {
  defaultPresetId: string;
  presets: GatePreset[];     // org-defined catalog
  locks?: OrgLocks;
};

const ORG_KEY   = 'tc.policy.org.v1';
const USER_KEY  = 'tc.policy.presets.v1';
function SESSION_KEY(sid: string){ return `tc.policy.session.${sid}.v1`; }

export const DEFAULT_PRESETS: GatePreset[] = [
  { id: 'safe',       name: 'Safe',       thresholds: { slipCapMaxBps: 8,  killGapMaxBps: 20 }, notes: 'Loss-minimizing default' },
  { id: 'balanced',   name: 'Balanced',   thresholds: { slipCapMaxBps: 12, killGapMaxBps: 30 }, notes: 'Project standard' },
  { id: 'aggressive', name: 'Aggressive', thresholds: { slipCapMaxBps: 18, killGapMaxBps: 45 }, notes: 'Expert only' }
];

export function loadOrgPolicy(): OrgPolicy {
  try{
    const raw = localStorage.getItem(ORG_KEY);
    if(!raw) return { defaultPresetId: 'balanced', presets: DEFAULT_PRESETS, locks: {} };
    const j = JSON.parse(raw);
    if(!Array.isArray(j?.presets)) j.presets = DEFAULT_PRESETS;
    if(!j.defaultPresetId) j.defaultPresetId = 'balanced';
    if(!j.locks) j.locks = {};
    return j;
  }catch{
    return { defaultPresetId: 'balanced', presets: DEFAULT_PRESETS, locks: {} };
  }
}
export function saveOrgPolicy(p: OrgPolicy){
  localStorage.setItem(ORG_KEY, JSON.stringify(p));
}

export function loadUserConfig(): GateConfig {
  try{
    const raw = localStorage.getItem(USER_KEY);
    if(!raw) return { activePresetId: 'balanced', presets: DEFAULT_PRESETS };
    const j = JSON.parse(raw);
    if(!Array.isArray(j?.presets)) j.presets = DEFAULT_PRESETS;
    if(!j.activePresetId) j.activePresetId = 'balanced';
    return j;
  }catch{
    return { activePresetId: 'balanced', presets: DEFAULT_PRESETS };
  }
}
export function saveUserConfig(cfg: GateConfig){
  localStorage.setItem(USER_KEY, JSON.stringify(cfg));
}

export function loadSessionConfig(sessionId: string): GateConfig {
  try{
    const raw = localStorage.getItem(SESSION_KEY(sessionId));
    if(!raw) return { activePresetId: 'inherit', presets: [] } as any;
    return JSON.parse(raw);
  }catch{
    return { activePresetId: 'inherit', presets: [] } as any;
  }
}
export function saveSessionConfig(sessionId: string, cfg: GateConfig){
  localStorage.setItem(SESSION_KEY(sessionId), JSON.stringify(cfg));
}

/**
 * Resolve thresholds in this order:
 *  1) org default preset thresholds
 *  2) if not locked → overlay user active preset thresholds
 *  3) if not locked → overlay session active preset thresholds
 */
export function resolveThresholds(sessionId?: string | null){
  const org = loadOrgPolicy();
  const user = loadUserConfig();
  const session = sessionId ? loadSessionConfig(sessionId) : null;

  const find = (id: string | undefined, catalog: GatePreset[]) => catalog.find(p => p.id === id) || catalog[0];

  const orgPreset = find(org.defaultPresetId, org.presets);
  let t = { ...orgPreset.thresholds };

  const locks = org.locks || {};

  const userPreset = find(user.activePresetId, user.presets);
  if(!locks.slipCapMaxBps && typeof userPreset?.thresholds?.slipCapMaxBps === 'number'){
    t.slipCapMaxBps = userPreset.thresholds.slipCapMaxBps;
  }
  if(!locks.killGapMaxBps && typeof userPreset?.thresholds?.killGapMaxBps === 'number'){
    t.killGapMaxBps = userPreset.thresholds.killGapMaxBps;
  }

  if(session && session.activePresetId && session.activePresetId !== 'inherit'){
    const catalog = (session.presets?.length ? session.presets : org.presets);
    const sessPreset = find(session.activePresetId, catalog);
    if(!locks.slipCapMaxBps && typeof sessPreset?.thresholds?.slipCapMaxBps === 'number'){
      t.slipCapMaxBps = sessPreset.thresholds.slipCapMaxBps;
    }
    if(!locks.killGapMaxBps && typeof sessPreset?.thresholds?.killGapMaxBps === 'number'){
      t.killGapMaxBps = sessPreset.thresholds.killGapMaxBps;
    }
  }

  return { thresholds: t, org, user, session };
}
