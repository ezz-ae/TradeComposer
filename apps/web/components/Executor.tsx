
"use client";
import { useMemo, useState } from "react";
import { useRisk } from "../contexts/RiskContext";

type Guardrails = { dailyCapUsd:number; slipCapBps:number; killGapBps:number };
type Policy = { sizePct:number; slipCapBps:number; ttlMs:number };

export default function Executor({ rNow, onReview }:{ rNow:number; onReview:(intent:any)=>void }){
  const { knobs } = useRisk();
  const rails: Guardrails = { dailyCapUsd: 5000, slipCapBps: 12, killGapBps: 30 };
  const slipKnob = knobs.find(k=>k.id==='slipCap')!.value;
  const ttlKnob  = knobs.find(k=>k.id==='ttl')!.value;

  const policy: Policy = useMemo(()=>{
    // simple mapping from rNow (0..1.2) to size% (0.5%..5%)
    const sizePct = clamp(0.5 + (rNow*4), 0.5, 5.0);
    const slipCapBps = Math.min(rails.slipCapBps, slipKnob);
    const ttlMs = Math.max(400, Math.min(1500, ttlKnob));
    return { sizePct, slipCapBps, ttlMs };
  }, [rNow, slipKnob, ttlKnob]);

  const breachSlip = slipKnob > rails.slipCapBps;
  const [side, setSide] = useState<"buy"|"sell">("buy");

  function emitReview(){
    const intent = {
      type: "replace_only_quote",
      side,
      size_pct: policy.sizePct,
      slip_cap_bps: policy.slipCapBps,
      ttl_ms: policy.ttlMs
    };
    onReview(intent);
  }

  return (
    <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Executor</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:12 }}>
        <div>
          <div style={{ fontSize:12, opacity:.6 }}>Side</div>
          <select value={side} onChange={e=>setSide(e.target.value as any)} style={{ padding:6, borderRadius:8, border:"1px solid #ddd" }}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize:12, opacity:.6 }}>Size % of equity</div>
          <div style={{ fontWeight:600 }}>{policy.sizePct.toFixed(2)}%</div>
        </div>
        <div>
          <div style={{ fontSize:12, opacity:.6 }}>TTL (ms)</div>
          <div style={{ fontWeight:600 }}>{policy.ttlMs}</div>
        </div>
      </div>

      <div style={{ marginTop:12, display:"flex", gap:16, alignItems:"center" }}>
        <div>
          <div style={{ fontSize:12, opacity:.6 }}>Slip Cap (bps)</div>
          <div style={{ fontWeight:600, color: breachSlip? '#DC2626':'inherit' }}>
            {policy.slipCapBps}{breachSlip? ' (capped by rails)':''}
          </div>
        </div>
        <div style={{ fontSize:12, opacity:.6 }}>Daily Cap (USD)</div>
        <div style={{ fontWeight:600 }}>${rails.dailyCapUsd.toLocaleString()}</div>
        <button onClick={emitReview} style={{ marginLeft:'auto', padding:'8px 12px', borderRadius:8, background:'#111827', color:'#fff' }}>
          Review Packet
        </button>
      </div>
    </div>
  );
}

function clamp(v:number, lo:number, hi:number){ return Math.max(lo, Math.min(hi, v)); }
