
import { idbGet } from './idb';

const PRESETS_KEY = 'tc.composer.presets.v1';

export async function exportPack(){
  // journal from idb
  const journal = await idbGet('journal','items') || [];
  // presets from localStorage
  let presets: Record<string, any> = {};
  try{ presets = JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}'); }catch{}
  // env (redacted client-safe)
  const env = {
    PARTNER_API_URL: process.env.NEXT_PUBLIC_PARTNER_API_URL || process.env.PARTNER_API_URL || 'http://localhost:8080'
  };
  const body = { journal: { items: journal }, presets, env };
  const r = await fetch('/api/export', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const blob = await r.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'trade-composer-pack.zip';
  a.click(); URL.revokeObjectURL(a.href);
}
