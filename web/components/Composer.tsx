
"use client";
import { useEffect, useMemo, useState } from "react";

type Matcher = { id:string; name:string; weight:number; delay:number; enabled:boolean };

const KEY = "tc.composer.v1";

export default function Composer({ baseExpected }:{ baseExpected:number[] | null }){
  const [matchers, setMatchers] = useState<Matcher[]>([
    { id:"m1", name:"Momentum(20)", weight: 0.6, delay: 0, enabled:true },
    { id:"m2", name:"Revert(EMA)",  weight:-0.3, delay: 3, enabled:true },
    { id:"m3", name:"Breakout",     weight: 0.4, delay: 6, enabled:false},
    { id:"m4", name:"WickGuard",    weight:-0.2, delay: 1, enabled:false},
  ]);

  // load/save presets
  useEffect(()=>{
    try{ const raw = localStorage.getItem(KEY); if(raw) setMatchers(JSON.parse(raw)); }catch{}
  }, []);
  useEffect(()=>{
    try{ localStorage.setItem(KEY, JSON.stringify(matchers)); }catch{}
  }, [matchers]);

  // fake matcher waveforms derived from baseExpected (or zeros)
  const ghosts = useMemo(()=>{
    const base = baseExpected && baseExpected.length ? baseExpected : Array(60).fill(0);
    function shifted(arr:number[], d:number){
      if(!d) return arr.slice();
      const out = Array(arr.length).fill(0);
      for(let i=0;i<arr.length;i++){
        const j = i-d;
        out[i] = j>=0? arr[j] : 0;
      }
      return out;
    }
    function scale(arr:number[], k:number){ return arr.map(v=>v*k); }
    const active = matchers.filter(m=>m.enabled);
    const parts = active.map(m => scale(shifted(base, m.delay), m.weight));
    // sum
    const sum = Array(base.length).fill(0);
    for(const p of parts){ for(let i=0;i<sum.length;i++){ sum[i]+=p[i]||0; } }
    // normalize to base amplitude
    const maxAbs = Math.max(1, ...sum.map(v=>Math.abs(v)));
    const norm = sum.map(v=> v / maxAbs * (Math.max(1, ...base.map(b=>Math.abs(b))) ));
    return { composite: norm, parts: active };
  }, [matchers, baseExpected]);

  function set(id:string, patch: Partial<Matcher>){
    setMatchers(prev => prev.map(m => m.id===id ? {...m, ...patch} : m));
  }

  return (
    <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:600 }}>Composer</div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setMatchers(ms=>ms.map(m=>({...m, enabled:false})))}
            style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #ddd", background:"#fff" }}>Mute All</button>
          <button onClick={()=>setMatchers(ms=>ms.map(m=>({...m, enabled:true})))}
            style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #ddd", background:"#fff" }}>Arm All</button>
        </div>
      </div>

      <div style={{ marginTop:12, display:"grid", gridTemplateColumns:"1.2fr 1fr 1fr 0.6fr", gap:8, fontSize:13 }}>
        <div style={{ opacity:.6 }}>Matcher</div>
        <div style={{ opacity:.6 }}>Weight (−1..+1)</div>
        <div style={{ opacity:.6 }}>Delay (steps)</div>
        <div style={{ opacity:.6 }}>On</div>
        {matchers.map(m => (
          <>
            <div key={m.id+"n"}>{m.name}</div>
            <input key={m.id+"w"} type="range" min={-1} max={1} step={0.05} value={m.weight}
              onChange={e=>set(m.id, { weight: Number(e.target.value) })}/>
            <input key={m.id+"d"} type="range" min={0} max={12} step={1} value={m.delay}
              onChange={e=>set(m.id, { delay: Number(e.target.value) })}/>
            <input key={m.id+"e"} type="checkbox" checked={m.enabled}
              onChange={e=>set(m.id, { enabled: e.target.checked })}/>
          </>
        ))}
      </div>

      <div style={{ marginTop:10, fontSize:12, opacity:.7 }}>
        Composite ghost overlays the Scope.
      </div>

      {/* Pass composite via DOM dataset for parent to read if needed */}
      <div data-composite={JSON.stringify(ghosts.composite)} style={{ display:"none" }} />
    </div>
  );
}
