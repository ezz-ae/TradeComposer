
import { idbGet } from './idb';
import { hashString } from './hash';
import { loadGateConfig } from '../lib/policyPresets';

const PRESETS_KEY = 'tc.composer.presets.v1';
const SIM_KEY = 'tc.sim.last';
const REASONS_KEY = 'tc.reasons.v1';

export async function exportPack(){
  const journal = await idbGet('journal','items') || [];
  const frames = journal.filter((i:any)=>i.type==='ws').map((i:any, idx:number)=>{
    const exp = i.snapshot?.expected; const real = i.snapshot?.real;
    const last = (arr:any)=> Array.isArray(arr) && arr.length ? arr[arr.length-1] : null;
    return {
      index: idx,
      ts: i.ts,
      r: i.snapshot?.r ?? null,
      confidence: i.snapshot?.confidence ?? null,
      expected_last: last(exp),
      real_last: last(real)
    };
  });

  let presets: Record<string, any> = {};
  try{ presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}'); }catch{}
  let sim: any = null;
  try{ sim = JSON.parse(localStorage.getItem(SIM_KEY) || 'null'); }catch{}
  let reasons: any[] = [];
  try{ reasons = JSON.parse(localStorage.getItem(REASONS_KEY) || '[]'); }catch{}

  const env = {
    PARTNER_API_URL: process.env.NEXT_PUBLIC_PARTNER_API_URL || process.env.PARTNER_API_URL || 'http://localhost:8080'
  };
  const scope = (window as any).__TC_SCOPE || null;
  const risk = (window as any).__TC_RISK || null;
  const plan = (window as any).__TC_PLAN || null;
  let queue: any = null; try{ const r = await fetch('/api/queue'); queue = await r.json(); }catch{}

  // NEW: gate presets export
  let gate = null;
  try { gate = loadGateConfig(); } catch {}

  const body = { journal: { items: journal }, presets, env, scope, risk, plan, sim: sim?.result || sim, queue, frames, ladder: sim?.result?.book || sim?.book || { bids:[], asks:[] }, reasons, gate };
  const r = await fetch('/api/export', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const blob = await r.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'trade-composer-pack.zip';
  a.click(); URL.revokeObjectURL(a.href);
}
