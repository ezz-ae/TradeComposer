
"use client";
import { useEffect, useRef } from "react";
export default function ScopeCanvas({ expected, real }:{ expected:number[]; real:number[] }){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext('2d'); if(!ctx) return;
    const W = c.width = c.clientWidth; const H = c.height = 220;
    ctx.clearRect(0,0,W,H);
    const maxAbs = Math.max(20, ...expected.map(Math.abs), ...real.map(Math.abs));
    const y = (v:number)=> H/2 - (v/maxAbs)*(H*0.4);
    function draw(line:number[], dashed:boolean, lw:number){
      ctx.beginPath(); ctx.setLineDash(dashed ? [6,6] : []);
      line.forEach((v,i)=>{ const x = (i/(line.length-1))*W; i?ctx.lineTo(x,y(v)):ctx.moveTo(x,y(v)); });
      ctx.lineWidth = lw; ctx.stroke();
    }
    ctx.strokeStyle = "#9CA3AF"; draw(expected, true, 2);
    ctx.strokeStyle = "#111827"; draw(real, false, 2);
  }, [expected, real]);
  return <canvas ref={ref} style={{ width: "100%", height: 220, display:"block", borderRadius:12, background:"#fafafa", border:"1px solid #eee" }} />;
}
