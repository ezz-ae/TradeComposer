
"use client";
import { useEffect, useState } from 'react';

const TEMPLATES = [
  'Liquidity spike, need exposure before reclaim; stop is defined and tight.',
  'Event-driven move; waiting risks missing RR window; risk is quantified.',
  'Breaker retest with confluence; front-running cascading fills under cap.'
];

export default function ForceShield({ open, defaultReason, onCancel, onConfirm }:{ open:boolean; defaultReason?:string; onCancel:()=>void; onConfirm:(reason:string)=>void }){
  const [reason, setReason] = useState('');
  const [ack, setAck] = useState(false);
  useEffect(()=>{ if(open){ setReason(defaultReason || ''); setAck(false); } }, [open, defaultReason]);
  if(!open) return null;
  const valid = ack && reason.trim().length >= 12;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2100 }} onClick={onCancel}>
      <div style={{ width:600, background:'#fff', borderRadius:12, padding:16 }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:700, marginBottom:8 }}>Force Confirm</div>
        <div style={{ fontSize:13, opacity:.8, marginBottom:8 }}>Explain why Force is necessary and acknowledge risk.</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:8 }}>
          {TEMPLATES.map((t)=> (
            <button key={t} onClick={()=>setReason(t)} style={{ padding:'4px 8px', borderRadius:8, border:'1px solid #ddd', background:'#fff', fontSize:12 }}>{t}</button>
          ))}
        </div>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason (min 12 chars)"
          style={{ width:'100%', minHeight:120, border:'1px solid #ddd', borderRadius:8, padding:8 }} />
        <label style={{ display:'flex', gap:8, alignItems:'center', marginTop:8, fontSize:13 }}>
          <input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)} />
          I accept execution risk and confirm guardrails are understood.
        </label>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
          <button onClick={onCancel} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Cancel</button>
          <button onClick={()=>valid && onConfirm(reason)} disabled={!valid}
            style={{ padding:'8px 12px', borderRadius:8, background: valid? '#DC2626':'#9CA3AF', color:'#fff' }}>Force Now</button>
        </div>
      </div>
    </div>
  );
}
