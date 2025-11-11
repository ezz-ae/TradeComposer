
"use client";
import { useState } from "react";
export default function SEETray({ onAct }:{ onAct:(mode:string)=>Promise<void> }){
  const [stage, setStage] = useState<string| null>(null);
  async function run(mode:string){
    setStage("draft"); await delay(120);
    setStage("validate"); await delay(120);
    setStage("simulate"); await delay(120);
    setStage("shadow"); await delay(120);
    setStage("canary"); await delay(120);
    await onAct(mode); setStage(null);
  }
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:12, border:"1px solid #eee", borderRadius:12 }}>
      <button onClick={()=>run("review")}     style={btn("#6B7280")}>REVIEW</button>
      <button onClick={()=>run("test")}       style={btn("#059669")}>TEST</button>
      <button onClick={()=>run("prioritize")} style={btn("#D97706")}>PRIORITIZE</button>
      <button onClick={()=>run("force")}      style={btn("#DC2626")}>FORCE</button>
      <div style={{ marginLeft: 8, fontSize:12, opacity:.7 }}>{stage ? `SEE: ${stage}` : "SEE idle"}</div>
    </div>
  );
}
function btn(bg:string){ return { padding:"8px 12px", borderRadius:8, background:bg, color:"white", border:0, cursor:"pointer" } as const; }
function delay(ms:number){ return new Promise(r=>setTimeout(r,ms)); }
