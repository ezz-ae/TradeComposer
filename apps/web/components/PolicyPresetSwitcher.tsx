
"use client";
import { usePolicyGate } from '@/app/hooks/usePolicyGate';

export default function PolicyPresetSwitcher({ riskKnobs, scope }:{ riskKnobs:any[]; scope:any }){
  const { presets, config, setPreset, decision } = usePolicyGate(riskKnobs, scope);
  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:600 }}>Policy Preset</div>
        <div style={{ fontSize:12, opacity:.7 }}>slip ≤ {decision.thresholds.slipCapMaxBps} bps • kill ≤ {decision.thresholds.killGapMaxBps} bps</div>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
        {presets.map(p => (
          <button key={p.id} onClick={()=>setPreset(p.id)}
            style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background: p.id===config.activePresetId? '#111827':'#fff', color: p.id===config.activePresetId? '#fff':'#111' }}>
            {p.name}
          </button>
        ))}
      </div>
      <div style={{ fontSize:12, opacity:.7, marginTop:6 }}>
        {presets.find(p=>p.id===config.activePresetId)?.notes}
      </div>
    </div>
  );
}
