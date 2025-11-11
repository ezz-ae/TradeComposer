
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSessionWS } from "./useSessionWS";
import ScopeCanvas from "../components/ScopeCanvas";
import SEETray from "../components/SEETray";
import RiskAdaptor from "../components/RiskAdaptor";
import Composer from "../components/Composer";
import Executor from "../components/Executor";
import ReviewOverlay from "../components/ReviewOverlay";
import Journal from "../components/Journal";
import Guardrails from "../components/Guardrails";
import PrioritizeQueue from "../components/PrioritizeQueue";
import QuoterSim from "../components/QuoterSim";
import { useJournal } from "../hooks/useJournal";
import { ToasterProvider, useToast } from "../components/Toaster";
import { RiskProvider } from "../contexts/RiskContext";

function PageInner(){
  const [plan, setPlan] = useState<any>(null);
  const [symbol, setSymbol] = useState("BTCUSD");
  const [reviewIntent, setReviewIntent] = useState<any>(null);
  const [simHook] = useState(()=> QuoterSim());
  const live = useSessionWS("demo");
  const toast = useToast();
  const J = useJournal();

  const compositeRef = useRef<number[] | null>(null);
  useEffect(()=>{
    const el = document.querySelector('[data-composite]') as HTMLElement | null;
    if(!el) { compositeRef.current = null; return; }
    try{ compositeRef.current = JSON.parse(el.dataset.composite || "[]"); }catch{ compositeRef.current = null; }
  });

  useEffect(()=>{
    let t:any;
    if(live){
      t = setInterval(()=>{
        J.push({ type:"ws", ts: Date.now(), snapshot: live });
      }, 2000);
    }
    return ()=> t && clearInterval(t);
  }, [live?.ts]);

  async function onCheckchart() {
    const r = await fetch("/api/plan", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ symbol }) });
    const data = await r.json();
    setPlan(data);
    J.push({ type:"api", ts: Date.now(), path:"/api/plan", ok:true, payload:data });
    toast({ text:`Plan loaded for ${symbol}`, kind:"success" });
  }

  async function onAct(mode: string){
    J.push({ type:"see", mode, ts: Date.now(), detail: plan?.tasks?.[1]?.order || null });
    const r = await fetch("/api/orders", { method:"POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ mode, intent: plan?.tasks?.[1]?.order || null }) });
    const ok = r.ok;
    J.push({ type:"api", ts: Date.now(), path:"/api/orders", ok, payload: await r.text() });
    // enqueue into queue
    const why = plan?.tasks?.[1]?.desc || "SEE action";
    try{ await fetch('/api/queue', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, symbol, why }) }); }catch{}
    toast({ text: ok ? `SEE ${mode.toUpperCase()} sent` : `SEE ${mode.toUpperCase()} failed`, kind: ok? "success":"error" });
  }

  useHotkeys('shift+t', ()=> onAct('test'), [plan]);
  useHotkeys('shift+p', ()=> onAct('prioritize'), [plan]);
  useHotkeys('shift+r', ()=> onAct('review'), [plan]);
  useHotkeys('shift+enter', ()=> onAct('force'), [plan]);
  useHotkeys('esc, esc', ()=> { J.setReplay(false); toast({ text:"Panic (UI state cleared)", kind:"error" }); }, [plan]);

  const scopeData = useMemo(()=>{
    if(!J.replay || !live) return live;
    const wsItems = J.items.filter(i=>i.type==="ws");
    if(!wsItems.length) return live;
    const frame = wsItems[Math.max(0, Math.min(J.replayIndex, wsItems.length-1))] as any;
    return frame.snapshot;
  }, [J.replay, J.replayIndex, J.items, live]);

  const ghost = useMemo(()=> compositeRef.current || null, [compositeRef.current]);

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, Arial", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Trade Composer</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input value={symbol} onChange={e=>setSymbol(e.target.value)} placeholder="Symbol e.g. BTCUSD"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8 }}/>
        <button onClick={onCheckchart} style={{ padding: "8px 12px", borderRadius: 8, background: "black", color: "white" }}>Checkchart</button>
      </div>

      {plan && (
        <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div><b>Bias:</b> {plan.regime.bias}</div>
          <div style={{ opacity: .7, fontSize: 13 }}>
            Levels: {plan.levels.map((l:any)=>`${l.type}@${l.price}`).join(", ")}
          </div>
        </section>
      )}

      <div style={{ marginTop: 16 }}>
        <SEETray onAct={onAct} />
      </div>

      {scopeData && (
        <section style={{ marginTop: 16 }}>
          <div style={{ fontWeight:600, marginBottom:8 }}>Scope — Expected (dashed) vs Real (solid) + Composite (blue)</div>
          <ScopeCanvas expected={scopeData.expected} real={scopeData.real} ghost={ghost || undefined} />
          <div style={{ fontSize:12, opacity:.7, marginTop:6 }}>
            Confidence: {(scopeData.confidence*100).toFixed(0)}% • R(t): {(scopeData.r*100).toFixed(0)}%
          </div>
        </section>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop: 16 }}>
        <RiskAdaptor />
        <Guardrails />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop: 16 }}>
        <Executor rNow={scopeData ? scopeData.r : 0.5} onReview={setReviewIntent} onSim={simHook.simulate} />
        <PrioritizeQueue />
      </div>

      <div style={{ marginTop: 16 }}>
        <Composer baseExpected={scopeData ? scopeData.expected : null} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop: 16 }}>
        <Journal items={J.items} replay={J.replay} setReplay={J.setReplay}
          replayIndex={J.replayIndex} setReplayIndex={J.setReplayIndex} onExport={J.exportJSON} />
        {simHook.view}
      </div>

      <ReviewOverlay intent={reviewIntent} onClose={()=>setReviewIntent(null)} />
    </main>
  );
}

export default function Page(){
  return (
    <ToasterProvider>
      <RiskProvider>
        <PageInner />
      </RiskProvider>
    </ToasterProvider>
  );
}
