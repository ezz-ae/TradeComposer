
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
import HotkeysLegend from "../components/HotkeysLegend";
import ReplayScrubber from "../components/ReplayScrubber";
import { useJournal } from "../hooks/useJournal";
import { ToasterProvider, useToast } from "../components/Toaster";
import { RiskProvider } from "../contexts/RiskContext";
import { useRisk } from "../contexts/RiskContext";
import { exportPack } from "../lib/exportPack";
import { buildReason } from "../lib/reason";
import { hashString } from "../lib/hash";

declare global { interface Window { __TC_SCOPE?: any; __TC_RISK?: any; __TC_PLAN?: any; __TC_REPLAY?: (i:number)=>void } }

const REASONS_KEY = 'tc.reasons.v1';

function PageInner(){
  const [plan, setPlan] = useState<any>(null);
  const [symbol, setSymbol] = useState("BTCUSD");
  const [reviewIntent, setReviewIntent] = useState<any>(null);
  const [defaultReviewReason, setDefaultReviewReason] = useState<string>('');
  const [simHook] = useState(()=> QuoterSim());
  const live = useSessionWS("demo");
  const toast = useToast();
  const J = useJournal();
  const risk = useRisk();

  const compositeRef = useRef<number[] | null>(null);
  useEffect(()=>{
    const el = document.querySelector('[data-composite]') as HTMLElement | null;
    if(!el) { compositeRef.current = null; return; }
    try{ compositeRef.current = JSON.parse(el.dataset.composite || "[]"); }catch{ compositeRef.current = null; }
  });

  useEffect(()=>{ window.__TC_RISK = risk.knobs; }, [risk.knobs]);

  useEffect(()=>{
    let t:any;
    if(live){
      window.__TC_SCOPE = live;
      t = setInterval(()=>{
        J.push({ type:"ws", ts: Date.now(), snapshot: live });
        window.__TC_SCOPE = live;
      }, 2000);
    }
    return ()=> t && clearInterval(t);
  }, [live?.ts]);

  // Replay bridge
  useEffect(()=>{
    (window as any).__TC_REPLAY = (i:number)=>{
      J.setReplay(true);
      J.setReplayIndex(i);
      toast({ text:`Replay → frame ${i+1}`, kind:'success' });
    };
    return ()=>{ try{ delete (window as any).__TC_REPLAY; }catch{} };
  }, []);

  function captureContext(){
    let sim:any = null;
    try{ sim = JSON.parse(localStorage.getItem('tc.sim.last') || 'null'); }catch{}
    const scope = (window as any).__TC_SCOPE || null;
    const riskK = (window as any).__TC_RISK || null;
    const frameIdx = J.items.filter(i=>i.type==='ws').length - 1;
    return { scope, risk: riskK, plan, sim, frameIndex: Math.max(0, frameIdx) };
  }

  function saveReason(mode:'test'|'prioritize'|'force'|'review', reason:string){
    try{
      const now = Date.now();
      const entry = { ts: now, mode, symbol, reason, hash: hashString(`${now}:${mode}:${symbol}:${reason}`) };
      const arr = JSON.parse(localStorage.getItem(REASONS_KEY) || '[]');
      arr.push(entry);
      localStorage.setItem(REASONS_KEY, JSON.stringify(arr.slice(-1000)));
      J.push({ type:'reason', ts: now, payload: entry });
    }catch{}
  }

  async function onCheckchart() {
    const r = await fetch("/api/plan", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ symbol }) });
    const data = await r.json();
    setPlan(data);
    (window as any).__TC_PLAN = data;
    J.push({ type:"api", ts: Date.now(), path:"/api/plan", ok:true, payload:data });
    toast({ text:`Plan loaded for ${symbol}`, kind:"success" });
  }

  async function onAct(mode: string){
    const ctx = captureContext();
    const autoReason = buildReason({ mode: mode as any, symbol, plan: ctx.plan, riskKnobs: ctx.risk, scope: ctx.scope, frameIndex: ctx.frameIndex });
    saveReason(mode as any, autoReason);
    J.push({ type:"see", mode, ts: Date.now(), detail: plan?.tasks?.[1]?.order || null, reason:autoReason });
    const r = await fetch("/api/orders", { method:"POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ mode, intent: plan?.tasks?.[1]?.order || null, reason: autoReason }) });
    const ok = r.ok;
    J.push({ type:"api", ts: Date.now(), path:"/api/orders", ok, payload: await r.text() });
    const why = plan?.tasks?.[1]?.desc || "SEE action";
    const context = ctx;
    try{ await fetch('/api/queue', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, symbol, why, context }) }); }catch{}
    toast({ text: ok ? `SEE ${mode.toUpperCase()} sent` : `SEE ${mode.toUpperCase()} failed`, kind: ok? "success":"error" });
  }

  function railsState(){
    const slip = risk.knobs.find(k=>k.id==='slipCap')!.value;
    const kill = risk.knobs.find(k=>k.id==='killGap')!.value;
    return { slipCapped: slip>12, killHigh: kill>30 };
  }

  function prepareDefaultReviewReason(){
    const ctx = captureContext();
    const autoReason = buildReason({ mode:'force', symbol, plan: ctx.plan, riskKnobs: ctx.risk, scope: ctx.scope, frameIndex: ctx.frameIndex });
    setDefaultReviewReason(autoReason);
  }

  async function onSend(mode: 'test'|'prioritize'|'force', intent:any, payload?:any){
    const ctx = captureContext();
    const reason = payload?.reason || buildReason({ mode, symbol, plan: ctx.plan, riskKnobs: ctx.risk, scope: ctx.scope, frameIndex: ctx.frameIndex });
    saveReason(mode, reason);
    const body:any = { mode, intent, reason };
    const r = await fetch("/api/orders", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(body) });
    const ok = r.ok;
    J.push({ type:"api", ts: Date.now(), path:"/api/orders", ok, payload: await r.text() });
    toast({ text: ok ? `${mode.toUpperCase()} sent` : `${mode.toUpperCase()} failed`, kind: ok? "success":"error" });
    if(ok){
      setReviewIntent(null);
      const context = ctx;
      try{ await fetch('/api/queue', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, symbol, why: 'Review→'+mode, context }) }); }catch{}
    }
  }

  useHotkeys('shift+t', ()=> onAct('test'), [plan]);
  useHotkeys('shift+p', ()=> onAct('prioritize'), [plan]);
  useHotkeys('shift+r', ()=> { prepareDefaultReviewReason(); setReviewIntent(plan?.tasks?.[1]?.order || {}); }, [plan]);
  useHotkeys('shift+enter', ()=> onAct('force'), [plan]);
  useHotkeys('esc, esc', ()=> { J.setReplay(false); toast({ text:"Panic (clear UI state)", kind:"error" }); }, [plan]);

  const scopeData = useMemo(()=>{
    if(!J.replay || !live) return live;
    const wsItems = J.items.filter(i=>i.type==="ws");
    if(!wsItems.length) return live;
    const frame = wsItems[Math.max(0, Math.min(J.replayIndex, wsItems.length-1))] as any;
    return frame.snapshot;
  }, [J.replay, J.replayIndex, J.items, live]);

  const wsFrames = useMemo(()=> J.items.filter(i=>i.type==='ws'), [J.items]);
  const ghost = useMemo(()=> compositeRef.current || null, [compositeRef.current]);

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, Arial", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Trade Composer</h1>
        <button onClick={exportPack} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Export Zip</button>
      </div>

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
        <Executor rNow={scopeData ? scopeData.r : 0.5} onReview={(intent:any)=>{ prepareDefaultReviewReason(); setReviewIntent(intent); }} onSim={simHook.simulate} />
        <PrioritizeQueue />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop: 16 }}>
        <Composer baseExpected={scopeData ? scopeData.expected : null} />
        <HotkeysLegend />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop: 16 }}>
        <Journal items={J.items} replay={J.replay} setReplay={J.setReplay}
          replayIndex={J.replayIndex} setReplayIndex={J.setReplayIndex} onExport={J.exportJSON} />
        <ReplayScrubber total={wsFrames.length} index={J.replayIndex} onChange={J.setReplayIndex} />
      </div>

      <ReviewOverlay intent={reviewIntent} onClose={()=>setReviewIntent(null)} onSend={onSend} rails={railsState()} defaultReason={defaultReviewReason} />
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
