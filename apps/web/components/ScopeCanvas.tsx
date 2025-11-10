"use client";
import { useEffect, useRef } from "react";

export default function ScopeCanvas({ expected, real }:{ expected:number[], real:number[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.width = c.clientWidth; const H = c.height = 220;
    ctx.clearRect(0,0,W,H);

    function draw(line: number[], dashed=false) {
      if (!line?.length) return;
      const maxAbs = Math.max(20, ...line.map(v=>Math.abs(v)));
      const y = (v:number)=> H/2 - (v/maxAbs)*(H*0.4);
      ctx.beginPath();
      dashed ? ctx.setLineDash([6,6]) : ctx.setLineDash([]);
      line.forEach((v,i)=>{ const x = (i/(line.length-1))*W; i?ctx.lineTo(x,y(v)):ctx.moveTo(x,y(v)); });
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.strokeStyle = "#999"; draw(expected, true);
    ctx.strokeStyle = "#111"; draw(real, false);
  }, [expected, real]);

  return <canvas ref={ref} style={{ width: "100%", height: 220, display: "block", borderRadius: 12, background:"#fafafa", border:"1px solid #eee" }} />;
}
