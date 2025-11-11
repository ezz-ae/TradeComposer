
"use client";
import { useState } from 'react';
import { usePolicyGate } from '@/app/hooks/usePolicyGate';
import { DEFAULT_PRESETS } from '@/app/lib/policyPresets';

export default function OrgPolicyAdmin({ riskKnobs, scope }:{ riskKnobs:any[]; scope:any }){
  const { org, setOrgDefaultPreset, setOrgLock, decision } = usePolicyGate(riskKnobs, scope, null);
  const presets = org.presets?.length ? org.presets : DEFAULT_PRESETS;
  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:700 }}>Org Policy (Admin)</div>
        <div style={{ fontSize:12, opacity:.7 }}>Active: {org.defaultPresetId} • slip≤{decision.thresholds.slipCapMaxBps} • kill≤{decision.thresholds.killGapMaxBps}</div>
      </div>
      <div style={{ marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <div style={{ fontWeight:600 }}>Default Preset</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
            {presets.map(p=> (
              <button key={p.id} onClick={()=>setOrgDefaultPreset(p.id)}
                style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background: p.id===org.defaultPresetId? '#111827':'#fff', color: p.id===org.defaultPresetId? '#fff':'#111' }}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight:600 }}>Locks</div>
          <label style={{ display:'flex', gap:8, alignItems:'center', marginTop:8, fontSize:13 }}>
            <input type="checkbox" checked={!!org.locks?.slipCapMaxBps} onChange={e=>setOrgLock('slipCapMaxBps', e.target.checked)} />
            Lock slipCap threshold
          </label>
          <label style={{ display:'flex', gap:8, alignItems:'center', marginTop:8, fontSize:13 }}>
            <input type="checkbox" checked={!!org.locks?.killGapMaxBps} onChange={e=>setOrgLock('killGapMaxBps', e.target.checked)} />
            Lock killGap threshold
          </label>
        </div>
      </div>
    </div>
  );
}
