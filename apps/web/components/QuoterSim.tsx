
"use client";
import { useMemo, useState } from "react";

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

  const maxDepth = useMemo(()=>{
    if(!res?.book) return 1;
    const all = [...res.book.bids, ...res.book.asks].map(([,sz]:any)=>sz);
    return Math.max(1, ...all);
  }, [res]);
  const cell = (qty:number, max:number, side:'bid'|'ask')=>{
    const ratio = Math.min(1, qty/max);
    const base = side==='bid' ? [34,197,94] : [239,68,68]; // green/red
    const bg = `rgba(${base[0]},${base[1]},${base[2]},${0.15+0.55*ratio})`;
    return { background:bg, padding:'2px 6px', borderRadius:6, textAlign:'right', fontVariantNumeric: 'tabular-nums' } as const;
  };

  return { simulate, view: (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Quoter Simulator</div>
      {!res && <div style={{ fontSize:12, opacity:.7 }}>Run a simulation from the Executor.</div>}
      {res && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:12, fontSize:13, marginBottom:12 }}>
            <div><div style={{opacity:.6}}>Status</div><div style={{fontWeight:700}}>{res.status}</div></div>
            <div><div style={{opacity:.6}}>Mid</div><div style={{fontWeight:700}}>{res.mid}</div></div>
            <div><div style={{opacity:.6}}>VW Price</div><div style={{fontWeight:700}}>{res.vw_price ?? '-'}</div></div>
            <div><div style={{opacity:.6}}>Slip (bps)</div><div style={{fontWeight:700}}>{res.slip_bps ?? '-'}</div></div>
            <div><div style={{opacity:.6}}>Filled %</div><div style={{fontWeight:700}}>{res.filled_pct != null ? (res.filled_pct*100).toFixed(1)+'%' : '-'}</div></div>
            <div><div style={{opacity:.6}}>Cap (bps) / TTL</div><div style={{fontWeight:700}}>{res.slip_cap_bps} / {res.ttl_ms}ms</div></div>
          </div>

          {res.book && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <div style={{ fontSize:12, opacity:.7, marginBottom:6 }}>Bids</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 120px', gap:6 }}>
                  {res.book.bids.map((row:any, idx:number)=> (
                    <>
                      <div key={'bp'+idx} style={{ fontVariantNumeric:'tabular-nums' }}>{row[0]}</div>
                      <div key={'bq'+idx} style={cell(row[1], maxDepth, 'bid')}>{row[1]}</div>
                    </>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize:12, opacity:.7, marginBottom:6 }}>Asks</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 120px', gap:6 }}>
                  {res.book.asks.map((row:any, idx:number)=> (
                    <>
                      <div key={'ap'+idx} style={{ fontVariantNumeric:'tabular-nums' }}>{row[0]}</div>
                      <div key={'aq'+idx} style={cell(row[1], maxDepth, 'ask')}>{row[1]}</div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )};
}
