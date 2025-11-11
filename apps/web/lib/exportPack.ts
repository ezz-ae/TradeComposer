
import { idbGet } from './idb';

const PRESETS_KEY = 'tc.composer.presets.v1';
const SIM_KEY = 'tc.sim.last';

export async function exportPack(){
  // journal from idb
  const journal = await idbGet('journal','items') || [];
  // presets from localStorage
  let presets: Record<string, any> = {};
  try{ presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}'); }catch{}
  // sim (last book)
  let sim: any = null;
  try{ sim = JSON.parse(localStorage.getItem(SIM_KEY) || 'null'); }catch{}
  // env (client-safe)
  const env = {
    PARTNER_API_URL: process.env.NEXT_PUBLIC_PARTNER_API_URL || process.env.PARTNER_API_URL || 'http://localhost:8080'
  };
  // risk/scope/plan from window bridge
  const scope = (window as any).__TC_SCOPE || null;
  const risk = (window as any).__TC_RISK || null;
  const plan = (window as any).__TC_PLAN || null;
  // queue snapshot
  let queue: any = null;
  try{
    const r = await fetch('/api/queue'); queue = await r.json();
  }catch{}

  const body = { journal: { items: journal }, presets, env, scope, risk, plan, sim, queue };
  const r = await fetch('/api/export', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const blob = await r.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'trade-composer-pack.zip';
  a.click(); URL.revokeObjectURL(a.href);
}
