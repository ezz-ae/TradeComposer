
"use client";
import { useEffect, useState } from "react";

type Q = { id:string; mode:'test'|'prioritize'|'force'; symbol:string; why:string; ts:number };

export default function PrioritizeQueue(){
  const [items, setItems] = useState<Q[]>([]);
  useEffect(()=>{
    // seed demo items and rotate
    const seed:Q[] = [
      { id:'q1', mode:'prioritize', symbol:'BTCUSD', why:'Breakout+ momentum alignment', ts: Date.now() },
      { id:'q2', mode:'test', symbol:'ETHUSD', why:'Mean reversion into EMA200', ts: Date.now() - 15000 }
    ];
    setItems(seed);
    const t = setInterval(()=> setItems(prev => prev.length>4? prev.slice(1): [...prev, {
      id:'q'+Math.random().toString(36).slice(2,6),
      mode: Math.random()>0.8? 'force' : (Math.random()>0.5? 'prioritize':'test'),
      symbol: Math.random()>0.5? 'BTCUSD':'ETHUSD',
      why: Math.random()>0.5? 'Liquidity sweep setup' : 'Volatility compression breakout',
      ts: Date.now()
    }]), 8000);
    return ()=> clearInterval(t);
  }, []);

  const chip = (m:Q['mode']) => {
    const map:any = { test:'#059669', prioritize:'#D97706', force:'#DC2626' };
    return <span style={{ padding:'2px 8px', borderRadius:999, background: map[m], color:'#fff', fontSize:12 }}>{m.toUpperCase()}</span>;
  };

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Prioritize Queue</div>
      <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 2fr 140px', gap:8, fontSize:13 }}>
        <div style={{ opacity:.6 }}>Mode</div>
        <div style={{ opacity:.6 }}>Symbol</div>
        <div style={{ opacity:.6 }}>Why</div>
        <div style={{ opacity:.6 }}>When</div>
        {items.slice().reverse().map(it => (
          <>
            <div key={it.id+'m'}>{chip(it.mode)}</div>
            <div key={it.id+'s'}>{it.symbol}</div>
            <div key={it.id+'w'}>{it.why}</div>
            <div key={it.id+'t'}>{new Date(it.ts).toLocaleTimeString()}</div>
          </>
        ))}
      </div>
    </div>
  );
}
