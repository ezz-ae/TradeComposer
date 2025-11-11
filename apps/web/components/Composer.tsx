
"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Matcher = { id:string; name:string; weight:number; delay:number; enabled:boolean };

const KEY = "tc.composer.v1";
const PK = "tc.composer.presets.v1";

export default function Composer({ baseExpected }:{ baseExpected:number[] | null }){
  const [matchers, setMatchers] = useState<Matcher[]>([
    { id:"m1", name:"Momentum(20)", weight: 0.6, delay: 0, enabled:true },
    { id:"m2", name:"Revert(EMA)",  weight:-0.3, delay: 3, enabled:true },
    { id:"m3", name:"Breakout",     weight: 0.4, delay: 6, enabled:false},
    { id:"m4", name:"WickGuard",    weight:-0.2, delay: 1, enabled:false},
  ]);
  const [presets, setPresets] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  // load/save matchers
  useEffect(()=>{ try{ const raw = localStorage.getItem(KEY); if(raw) setMatchers(JSON.parse(raw)); }catch{} }, []);
  useEffect(()=>{ try{ localStorage.setItem(KEY, JSON.stringify(matchers)); }catch{} }, [matchers]);
  // load preset names
  useEffect(()=>{ try{ setPresets(Object.keys(JSON.parse(localStorage.getItem(PK)||"{}"))); }catch{} }, []);

  // waveform math
  const ghosts = useMemo(()=>{
    const base = baseExpected && baseExpected.length ? baseExpected : Array(60).fill(0);
    function shifted(arr:number[], d:number){
      if(!d) return arr.slice();
      const out = Array(arr.length).fill(0);
      for(let i=0;i<arr.length;i++){ const j=i-d; out[i] = j>=0? arr[j] : 0; }
      return out;
    }
    function scale(arr:number[], k:number){ return arr.map(v=>v*k); }
    const active = matchers.filter(m=>m.enabled);
    const parts = active.map(m => scale(shifted(base, m.delay), m.weight));
    const sum = Array(base.length).fill(0);
    for(const p of parts){ for(let i=0;i<sum.length;i++){ sum[i]+=p[i]||0; } }
    const maxAbs = Math.max(1, ...sum.map(v=>Math.abs(v)));
    const norm = sum.map(v=> v / maxAbs * (Math.max(1, ...base.map(b=>Math.abs(b))) ));
    return { composite: norm, parts: active };
  }, [matchers, baseExpected]);

  function set(id:string, patch: Partial<Matcher>){
    setMatchers(prev => prev.map(m => m.id===id ? {...m, ...patch} : m));
  }

  // presets API
  function savePreset(){
    const name = prompt("Preset name?"); if(!name) return;
    try{
      const all = JSON.parse(localStorage.getItem(PK)||"{}");
      all[name] = matchers; localStorage.setItem(PK, JSON.stringify(all));
      setPresets(Object.keys(all)); setSelected(name);
    }catch{}
  }
  function loadPreset(name:string){
    try{
      const all = JSON.parse(localStorage.getItem(PK)||"{}");
      if(all[name]) setMatchers(all[name]);
    }catch{}
  }
  function exportPreset(){
    const data = JSON.stringify(matchers, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "composer-preset.json"; a.click();
    URL.revokeObjectURL(a.href);
  }
  function importPreset(ev:any){
    const file = ev.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{ const arr = JSON.parse(String(reader.result)); if(Array.isArray(arr)) setMatchers(arr); }catch{}
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:600 }}>Composer</div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <select value={selected} onChange={e=>{ setSelected(e.target.value); loadPreset(e.target.value); }}
            style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd' }}>
            <option value="">Load preset…</option>
            {presets.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={savePreset} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Save</button>
          <button onClick={exportPreset} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Export</button>
          <label style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff', cursor:'pointer' }}>
            Import<input type="file" accept="application/json" onChange={importPreset} style={{ display:'none' }}/>
          </label>
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

      <div data-composite={JSON.stringify(ghosts.composite)} style={{ display:"none" }} />
    </div>
  );
}
