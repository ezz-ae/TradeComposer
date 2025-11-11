
"use client";
import { useState } from "react";
import { useSessionWS } from "./useSessionWS";
import ScopeCanvas from "../components/ScopeCanvas";
import SEETray from "../components/SEETray";
import RiskAdaptor from "../components/RiskAdaptor";

export default function Home() {
  const [plan, setPlan] = useState<any>(null);
  const [symbol, setSymbol] = useState("BTCUSD");
  const live = useSessionWS("demo");

  async function onCheckchart() {
    const r = await fetch("/api/plan", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ symbol }) });
    setPlan(await r.json());
  }

  async function onAct(mode: string){
    await fetch("/api/orders", { method:"POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ mode, intent: plan?.tasks?.[1]?.order || null }) });
  }

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, Arial", maxWidth: 1100, margin: "0 auto" }}>
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

      {live && (
        <section style={{ marginTop: 16 }}>
          <div style={{ fontWeight:600, marginBottom:8 }}>Scope — Expected (dashed) vs Real (solid)</div>
          <ScopeCanvas expected={live.expected} real={live.real} />
          <div style={{ fontSize:12, opacity:.7, marginTop:6 }}>
            Confidence: {(live.confidence*100).toFixed(0)}% • R(t): {(live.r*100).toFixed(0)}%
          </div>
        </section>
      )}

      <div style={{ marginTop: 16 }}>
        <RiskAdaptor />
      </div>
    </main>
  );
}
