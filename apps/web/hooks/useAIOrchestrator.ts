
"use client";
import { useState } from 'react';

export function useAIOrchestrator(){
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<any>(null);
  const [error, setError] = useState<string| null>(null);

  async function run(payload: any){
    setBusy(true); setError(null);
    try{
      const r = await fetch('/api/ai/orchestrate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const j = await r.json();
      if(!r.ok || j.ok === false){ throw new Error(j?.error || 'orchestrate_failed'); }
      setLast(j);
      return j;
    }catch(e:any){
      setError(e?.message || 'failed');
      throw e;
    }finally{
      setBusy(false);
    }
  }
  return { busy, last, error, run };
}
