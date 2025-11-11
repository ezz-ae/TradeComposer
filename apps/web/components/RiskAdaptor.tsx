
"use client";
import { useRisk } from "../contexts/RiskContext";

export default function RiskAdaptor(){
  const { knobs, set, R } = useRisk();
  return (
    <div style={{ border:"1px solid #eee", borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Risk Adaptor</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:8 }}>
        {knobs.map(k=>(
          <div key={k.id} style={{ border:"1px solid #f0f0f0", borderRadius:8, padding:8 }}>
            <div style={{ fontSize:12, marginBottom:6 }}>{k.label}</div>
            <input type="range" min={k.min} max={k.max} step={k.step} value={k.value}
              onChange={e=>set(k.id, Number(e.target.value))}
              style={{ width:"100%" }}/>
            <div style={{ fontSize:11, opacity:.7, marginTop:4 }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:8, fontSize:13, opacity:.8 }}>R(t): <b>{(R*100).toFixed(0)}%</b></div>
    </div>
  );
}
