
"use client";
import { useMemo, useState } from "react";
type Knob = { id:string; label:string; min:number; max:number; step:number; value:number };
export default function RiskAdaptor(){
  const [knobs, setKnobs] = useState<Knob[]>([
    { id:"traction",   label:"Traction",   min:0.5, max:1.8, step:0.01, value:1.0 },
    { id:"confGain",   label:"Conf Gain",  min:0.5, max:1.5, step:0.01, value:1.0 },
    { id:"volDamp",    label:"Vol Damp",   min:0.5, max:1.2, step:0.01, value:1.0 },
    { id:"wickGuard",  label:"Wick Guard", min:0.6, max:1.0, step:0.01, value:1.0 },
    { id:"slipCap",    label:"Slip Cap (bps)", min:4, max:20, step:1, value:8 },
    { id:"killGap",    label:"Kill Gap (bps)", min:10, max:50, step:1, value:25 },
    { id:"ttl",        label:"TTL (ms)",   min:400, max:1500, step:50, value:800 }
  ]);
  const R = useMemo(()=>{
    const traction = knobs.find(k=>k.id==="traction")!.value;
    const confGain = knobs.find(k=>k.id==="confGain")!.value;
    const volDamp  = knobs.find(k=>k.id==="volDamp")!.value;
    const wick     = knobs.find(k=>k.id==="wickGuard")!.value;
    let r = 0.5 * traction * confGain * volDamp * wick;
    r = Math.max(0.1, Math.min(1.2, r));
    return r;
  }, [knobs]);
  return (
    <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Risk Adaptor</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:8 }}>
        {knobs.map(k=>(
          <div key={k.id} style={{ border:"1px solid #f0f0f0", borderRadius:8, padding:8 }}>
            <div style={{ fontSize:12, marginBottom:6 }}>{k.label}</div>
            <input type="range" min={k.min} max={k.max} step={k.step} value={k.value}
              onChange={e=>setKnobs(prev=>prev.map(x=>x.id===k.id?{...x, value: Number(e.target.value)}:x))}
              style={{ width:"100%" }}/>
            <div style={{ fontSize:11, opacity:.7, marginTop:4 }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:8, fontSize:13, opacity:.8 }}>R(t): <b>{(R*100).toFixed(0)}%</b></div>
    </div>
  );
}
