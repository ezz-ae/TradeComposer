
"use client";
import { useRisk } from "../contexts/RiskContext";

export default function Guardrails(){
  const { knobs } = useRisk();
  const slip = knobs.find(k=>k.id==='slipCap')!.value;
  const kill = knobs.find(k=>k.id==='killGap')!.value;
  const ttl  = knobs.find(k=>k.id==='ttl')!.value;

  const rails = { dailyCapUsd: 5000, slipCapBps: 12, killGapBps: 30 };
  const slipBreach = slip > rails.slipCapBps;
  const killWarn   = kill > rails.killGapBps;

  function pill(ok:boolean){ return { padding:"2px 8px", borderRadius:999, background: ok? "#10B981":"#DC2626", color:"#fff", fontSize:12 } as const; }

  return (
    <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Guardrails</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:12 }}>
        <div>
          <div style={{ fontSize:12, opacity:.6 }}>Daily Cap (USD)</div>
          <div style={{ fontWeight:700 }}>$5,000</div>
          <div style={{ marginTop:6 }}><span style={pill(true)}>OK</span></div>
        </div>
        <div>
          <div style={{ fontSize:12, opacity:.6 }}>Slip Cap (bps)</div>
          <div style={{ fontWeight:700 }}>{slip} (rail: {rails.slipCapBps})</div>
          <div style={{ marginTop:6 }}><span style={pill(!slipBreach)}>{slipBreach? "CAPPED":"OK"}</span></div>
        </div>
        <div>
          <div style={{ fontSize:12, opacity:.6 }}>Kill Gap (bps)</div>
          <div style={{ fontWeight:700 }}>{kill} (rail: {rails.killGapBps})</div>
          <div style={{ marginTop:6 }}><span style={pill(!killWarn)}>{killWarn? "HIGH":"OK"}</span></div>
        </div>
      </div>
      <div style={{ marginTop:8, fontSize:12, opacity:.7 }}>TTL(ms): <b>{ttl}</b></div>
    </div>
  );
}
