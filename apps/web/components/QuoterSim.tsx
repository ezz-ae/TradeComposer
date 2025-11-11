
"use client";
import { useState } from "react";

export default function QuoterSim(){
  const [res, setRes] = useState<any>(null);
  async function simulate(intent:any){
    const body = {
      side: intent?.side || "buy",
      size_pct: intent?.size_pct || 1.0,
      slip_cap_bps: intent?.slip_cap_bps || 8,
      ttl_ms: intent?.ttl_ms || 800,
      equity_usd: 10000
    };
    const r = await fetch('/api/sim/quote', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const j = await r.json(); setRes(j);
  }
  return { simulate, view: (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Quoter Simulator</div>
      {!res && <div style={{ fontSize:12, opacity:.7 }}>Run a simulation from the Executor.</div>}
      {res && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:12, fontSize:13 }}>
          <div><div style={{opacity:.6}}>Status</div><div style={{fontWeight:700}}>{res.status}</div></div>
          <div><div style={{opacity:.6}}>Mid</div><div style={{fontWeight:700}}>{res.mid}</div></div>
          <div><div style={{opacity:.6}}>VW Price</div><div style={{fontWeight:700}}>{res.vw_price ?? '-'}</div></div>
          <div><div style={{opacity:.6}}>Slip (bps)</div><div style={{fontWeight:700}}>{res.slip_bps ?? '-'}</div></div>
          <div><div style={{opacity:.6}}>Filled %</div><div style={{fontWeight:700}}>{res.filled_pct != null ? (res.filled_pct*100).toFixed(1)+'%' : '-'}</div></div>
          <div><div style={{opacity:.6}}>Cap (bps) / TTL</div><div style={{fontWeight:700}}>{res.slip_cap_bps} / {res.ttl_ms}ms</div></div>
        </div>
      )}
    </div>
  )};
}
