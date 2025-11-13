
'use client';
import { useState } from 'react';

async function api(path:string, body:any){
  const base = process.env.NEXT_PUBLIC_PARTNER_API_URL || 'http://localhost:8080';
  const token = await (window as any)?.firebaseUser?.getIdToken?.();
  const r = await fetch(base + path, { method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
  if(!r.ok) throw new Error('api_failed');
  return await r.json();
}

export default function GeminiPage(){
  const [orgId] = useState('demo-org');
  const [userId] = useState('demo-user');
  const [mode, setMode] = useState<'coins'|'tokens'|'memecoins'>('coins');
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [scope, setScope] = useState<any>({ timeframe:'m15', venue:'spot', chain:'polygon' });
  const [plan, setPlan] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [combo, setCombo] = useState<any>(null);

  async function runPlan(){ setPlan(await api('/api/ai/plan', { orgId, userId, mode, symbol, scope })); }
  async function runRisk(){ setRisk(await api('/api/ai/risk', { orgId, userId, mode, symbol, scope })); }
  async function runOrchestrate(){ setCombo(await api('/api/ai/orchestrate', { orgId, userId, mode, symbol, scope })); }

  return (
    <div style={{ padding:16 }}>
      <h1>Gemini Task Center</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        <label>Mode
          <select value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="coins">coins</option>
            <option value="tokens">tokens</option>
            <option value="memecoins">memecoins</option>
          </select>
        </label>
        <label>Symbol <input value={symbol} onChange={e=>setSymbol(e.target.value)} /></label>
        <label>Timeframe <input value={scope.timeframe} onChange={e=>setScope({...scope, timeframe:e.target.value})} /></label>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button onClick={runPlan}>Plan</button>
        <button onClick={runRisk}>Risk</button>
        <button onClick={runOrchestrate}>Orchestrate</button>
      </div>
      {plan && <pre style={{ marginTop:12 }}>{JSON.stringify(plan, null, 2)}</pre>}
      {risk && <pre style={{ marginTop:12 }}>{JSON.stringify(risk, null, 2)}</pre>}
      {combo && <pre style={{ marginTop:12 }}>{JSON.stringify(combo, null, 2)}</pre>}
    </div>
  );
}
