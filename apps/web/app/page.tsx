
"use client";
import { useState } from "react";
import { useProKeys } from "./prokeys";

export default function Home() {
  const [plan, setPlan] = useState<any>(null);
  const [symbol, setSymbol] = useState("BTCUSD");
  useProKeys({ getIntent: () => plan?.tasks?.[1]?.order || null });

  async function onCheckchart() {
    const r = await fetch("/api/plan", { method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ symbol }) });
    setPlan(await r.json());
  }

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, Arial" }}>
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
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={()=>fetch("/api/orders",{method:"POST", headers:{'Content-Type':'application/json'},
              body: JSON.stringify({mode:"test", intent: plan.tasks[1].order})})} style={{ padding: "8px 12px", borderRadius: 8, background: "#059669", color: "white" }}>TEST</button>
            <button onClick={()=>fetch("/api/orders",{method:"POST", headers:{'Content-Type':'application/json'},
              body: JSON.stringify({mode:"prioritize", intent: plan.tasks[1].order})})} style={{ padding: "8px 12px", borderRadius: 8, background: "#d97706", color: "white" }}>PRIORITIZE</button>
            <button onClick={()=>fetch("/api/orders",{method:"POST", headers:{'Content-Type':'application/json'},
              body: JSON.stringify({mode:"force", intent: plan.tasks[1].order})})} style={{ padding: "8px 12px", borderRadius: 8, background: "#dc2626", color: "white" }}>FORCE</button>
          </div>
        </section>
      )}
    </main>
  );
}
