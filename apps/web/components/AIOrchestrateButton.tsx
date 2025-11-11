
"use client";
import { useAIOrchestrator } from '@/app/hooks/useAIOrchestrator';

export default function AIOrchestrateButton({ symbol, scope, risk, mode='prioritize', frameIndex=0 }:{ symbol:string; scope:any; risk:any; mode?:'test'|'prioritize'|'force'|'review'; frameIndex?:number }){
  const { busy, run } = useAIOrchestrator();
  return (
    <button
      onClick={()=>run({ symbol, scope, risk, mode, frameIndex })}
      disabled={busy}
      style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background: busy? '#eee':'#fff' }}>
      {busy? 'AI Orchestrating…' : 'AI Orchestrate (plan→reason→risk)'}
    </button>
  );
}
