
"use client";
import { useEffect, useState } from "react";

type Q = { id:string; mode:'test'|'prioritize'|'force'; symbol:string; why:string; status:'queued'|'priority'|'canceled'|'done'; ts:number; context?:any };

export default function PrioritizeQueue(){
  const [items, setItems] = useState<Q[]>([]);
  const [inspect, setInspect] = useState<Q | null>(null);

  async function refresh(){
    try{
      const r = await fetch('/api/queue'); const j = await r.json();
      if(j.ok) setItems(j.items);
    }catch{}
  }
  useEffect(()=>{ refresh(); }, []);

  useEffect(()=>{
    let ws: WebSocket | null = null;
    try{
      const url = (process.env.NEXT_PUBLIC_PARTNER_API_URL || "http://localhost:8080").replace("http","ws") + "/ws/queue";
      ws = new WebSocket(url);
      ws.onmessage = (ev)=>{
        try{
          const data = JSON.parse(ev.data);
          if(data.type === "snapshot"){ setItems(data.items); }
        }catch{}
      };
    }catch{}
    return ()=>{ try{ ws && ws.close(); }catch{} };
  }, []);

  async function promote(id:string){
    try{ await fetch('/api/queue/'+id, { method:'PATCH' }); refresh(); }catch{}
  }

  function replayFromContext(ctx:any){
    try{
      const fn = (window as any).__TC_REPLAY;
      if(fn) fn(ctx?.frameIndex ?? 0);
    }catch{}
  }

  const chip = (m:Q['mode']) => {
    const map:any = { test:'#059669', prioritize:'#D97706', force:'#DC2626' };
    return <span style={{ padding:'2px 8px', borderRadius:999, background: map[m], color:'#fff', fontSize:12 }}>{m.toUpperCase()}</span>;
  };
  const statusPill = (s:Q['status']) => {
    const map:any = { queued:'#374151', priority:'#2563EB', canceled:'#6B7280', done:'#10B981' };
    const label:any = { queued:'Queued', priority:'Priority', canceled:'Canceled', done:'Done' };
    return <span style={{ padding:'2px 8px', borderRadius:999, background: map[s], color:'#fff', fontSize:12 }}>{label[s]}</span>;
  };

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8, display:'flex', justifyContent:'space-between' }}>
        <span>Prioritize Queue</span>
        <button onClick={refresh} style={{ padding:'4px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Refresh</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'120px 90px 1fr 160px 180px', gap:8, fontSize:13 }}>
        <div style={{ opacity:.6 }}>Mode</div>
        <div style={{ opacity:.6 }}>Symbol</div>
        <div style={{ opacity:.6 }}>Why</div>
        <div style={{ opacity:.6 }}>When</div>
        <div style={{ opacity:.6 }}>Status / Actions</div>
        {items.slice().reverse().map(it => (
          <>
            <div key={it.id+'m'}>{chip(it.mode)}</div>
            <div key={it.id+'s'}>{it.symbol}</div>
            <div key={it.id+'w'}>{it.why}</div>
            <div key={it.id+'t'}>{new Date(it.ts*1000).toLocaleTimeString()}</div>
            <div key={it.id+'p'} style={{ display:'flex', gap:8, alignItems:'center' }}>
              {statusPill(it.status)}
              {it.status!=='priority' && it.status!=='done' && <button onClick={()=>promote(it.id)} style={{ padding:'4px 8px', borderRadius:6, border:'1px solid #ddd', background:'#fff' }}>Promote</button>}
              <button onClick={()=>setInspect(it)} style={{ padding:'4px 8px', borderRadius:6, border:'1px solid #ddd', background:'#fff' }}>Inspect</button>
            </div>
          </>
        ))}
      </div>

      {inspect && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1800 }} onClick={()=>setInspect(null)}>
          <div style={{ width:720, background:'#fff', borderRadius:12, padding:16 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Queue Item — {inspect.id}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <div style={{ fontSize:12, opacity:.7 }}>Meta</div>
                <pre style={{ fontSize:12, background:'#fafafa', border:'1px solid #eee', padding:8, borderRadius:8, maxHeight:300, overflow:'auto' }}>
{JSON.stringify({ mode: inspect.mode, symbol: inspect.symbol, why: inspect.why, ts: inspect.ts, status: inspect.status }, null, 2)}
                </pre>
              </div>
              <div>
                <div style={{ fontSize:12, opacity:.7 }}>Context</div>
                <pre style={{ fontSize:12, background:'#fafafa', border:'1px solid #eee', padding:8, borderRadius:8, maxHeight:300, overflow:'auto' }}>
{JSON.stringify(inspect.context || {}, null, 2)}
                </pre>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:12 }}>
              <button onClick={()=>replayFromContext(inspect.context)} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Replay Frame</button>
              <button onClick={()=>setInspect(null)} style={{ padding:'6px 10px', borderRadius:8, background:'#111827', color:'#fff' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
