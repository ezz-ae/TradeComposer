
"use client";
import { useEffect, useState } from "react";

type Q = { id:string; mode:'test'|'prioritize'|'force'; symbol:string; why:string; status:'queued'|'priority'|'canceled'|'done'; ts:number };

export default function PrioritizeQueue(){
  const [items, setItems] = useState<Q[]>([]);

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
      <div style={{ display:'grid', gridTemplateColumns:'120px 90px 1fr 160px 120px', gap:8, fontSize:13 }}>
        <div style={{ opacity:.6 }}>Mode</div>
        <div style={{ opacity:.6 }}>Symbol</div>
        <div style={{ opacity:.6 }}>Why</div>
        <div style={{ opacity:.6 }}>When</div>
        <div style={{ opacity:.6 }}>Status</div>
        {items.slice().reverse().map(it => (
          <>
            <div key={it.id+'m'}>{chip(it.mode)}</div>
            <div key={it.id+'s'}>{it.symbol}</div>
            <div key={it.id+'w'}>{it.why}</div>
            <div key={it.id+'t'}>{new Date(it.ts*1000).toLocaleTimeString()}</div>
            <div key={it.id+'p'} style={{ display:'flex', gap:8, alignItems:'center' }}>
              {statusPill(it.status)}
              {it.status!=='priority' && it.status!=='done' && <button onClick={()=>promote(it.id)} style={{ padding:'4px 8px', borderRadius:6, border:'1px solid #ddd', background:'#fff' }}>Promote</button>}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
