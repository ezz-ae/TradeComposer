
"use client";
import { usePolicyGate } from '@/app/hooks/usePolicyGate';
import { DEFAULT_PRESETS } from '@/app/lib/policyPresets';

export default function SessionPolicySelector({ sessionId, riskKnobs, scope }:{ sessionId:string; riskKnobs:any[]; scope:any }){
  const { org, session, setSessionPreset, decision } = usePolicyGate(riskKnobs, scope, sessionId);
  const presets = org.presets?.length ? org.presets : DEFAULT_PRESETS;
  const active = session?.activePresetId || 'inherit';
  const lockedFields = Object.keys(org.locks || {}).filter(k => (org.locks as any)[k]);

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:600 }}>Session Policy · {sessionId}</div>
        <div style={{ fontSize:12, opacity:.7 }}>{lockedFields.length? `Locked: ${lockedFields.join(', ')}` : 'No locks'}</div>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
        <button onClick={()=>setSessionPreset('inherit')} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background: active==='inherit'? '#111827':'#fff', color: active==='inherit'? '#fff':'#111' }}>Inherit Org/User</button>
        {presets.map(p=> (
          <button key={p.id} onClick={()=>setSessionPreset(p.id)}
            style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background: p.id===active? '#111827':'#fff', color: p.id===active? '#fff':'#111' }}>
            {p.name}
          </button>
        ))}
      </div>
      <div style={{ fontSize:12, opacity:.7, marginTop:6 }}>
        Effective thresholds → slip≤{decision.thresholds.slipCapMaxBps} • kill≤{decision.thresholds.killGapMaxBps}
      </div>
    </div>
  );
}
