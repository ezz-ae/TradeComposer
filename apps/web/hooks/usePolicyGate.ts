
"use client";
import { useCallback, useEffect, useState } from 'react';
import { evaluateGate, type GateDecision } from '@/app/lib/policy';

export function usePolicyGate(riskKnobs:any[], scope:any){
  const [decision, setDecision] = useState<GateDecision>({ blockForce:false, reasons:[], warnings:[], info:[] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rails = {
    slipCapBps: Number(riskKnobs?.find?.((k:any)=>k.id==='slipCap')?.value ?? 0),
    killGapBps: Number(riskKnobs?.find?.((k:any)=>k.id==='killGap')?.value ?? 0)
  };

  const refresh = useCallback(async ()=>{
    setLoading(true); setError(null);
    try{
      const r = await fetch('/api/ai/risk', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ risk: riskKnobs, scope }) });
      const j = await r.json();
      const dec = evaluateGate(rails, j?.critique);
      setDecision(dec);
    }catch(e:any){
      setError(e?.message || 'policy_failed');
      setDecision(evaluateGate(rails, null));
    }finally{
      setLoading(false);
    }
  }, [JSON.stringify(riskKnobs), JSON.stringify(scope)]);

  useEffect(()=>{ refresh(); }, [refresh]);

  return { decision, loading, error, refresh };
}
