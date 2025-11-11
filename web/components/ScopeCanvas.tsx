
"use client";
import { useEffect, useRef } from "react";

export default function ScopeCanvas({ expected, real, ghost }:{ expected:number[]; real:number[]; ghost?:number[] }){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext('2d'); if(!ctx) return;
    const W = c.width = c.clientWidth; const H = c.height = 220;
    ctx.clearRect(0,0,W,H);

    const maxAbs = Math.max(20, ...expected.map(Math.abs), ...real.map(Math.abs), ...(ghost||[]).map(Math.abs));
    const y = (v:number)=> H/2 - (v/maxAbs)*(H*0.4);

    function draw(line:number[], dashed:boolean, lw:number, color:string, alpha=1){
      ctx.beginPath();
      ctx.setLineDash(dashed ? [6,6] : []);
      ctx.globalAlpha = alpha;
      line.forEach((v,i)=>{
        const x = (i/(line.length-1))*W;
        i?ctx.lineTo(x,y(v)):ctx.moveTo(x,y(v));
      });
      ctx.lineWidth = lw;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    if(ghost && ghost.length) draw(ghost, false, 1.5, "#60A5FA", 0.8); // blue ghost
    draw(expected, true, 2, "#9CA3AF");   // dashed gray
    draw(real, false, 2, "#111827");      // solid black
  }, [expected, real, ghost]);
  return <canvas ref={ref} style={{ width: "100%", height: 220, display:"block", borderRadius:12, background:"#fafafa", border:"1px solid #eee" }} />;
}
