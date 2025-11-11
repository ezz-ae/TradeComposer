
"use client";
import { useState } from "react";
import { useProKeys } from "../hooks/useProKeys";

const Button = ({ onClick, color, children }: { onClick: (e: any) => void, color: string, children: any }) => (
  <button onClick={onClick} style={{ padding: "8px 12px", borderRadius: 8, background: color, color: "white" }}>
    {children}
  </button>
);

const LevelButtons = {
  Default: [
    { label: "TEST", color: "#059669" },
    { label: "PRIORITIZE", color: "#d97706" },
    { label: "REVIEW", color: "#2563eb" },
    { label: "FORCE", color: "#dc2626" },
  ],
  Medium: [
    { label: "PANIC", color: "#ef4444" },
    { label: "GHOST", color: "#6b7280" },
    { label: "TIME-WARP", color: "#8b5cf6" },
  ],
  Full: [
    { label: "PATCH-LOCK", color: "#4f46e5" },
    { label: "ROLLBACK", color: "#f97316" },
    { label: "SCOPE", color: "#14b8a6" },
  ]
};

const Dashboard = ({ level, onAction, intent }: { level: "Default" | "Medium" | "Full", onAction: (mode: string, intent: any) => void, intent: any }) => {
  let buttons = LevelButtons.Default;
  if (level === "Medium") {
    buttons = [...buttons, ...LevelButtons.Medium];
  } else if (level === "Full") {
    buttons = [...buttons, ...LevelButtons.Medium, ...LevelButtons.Full];
  }

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {buttons.map(({ label, color }) => (
        <Button key={label} onClick={() => onAction(label.toLowerCase(), intent)} color={color}>
          {label}
        </Button>
      ))}
    </div>
  );
};

export function TradeComposer() {
  const [plan, setPlan] = useState<any>(null);
  const [symbol, setSymbol] = useState("BTCUSD");
  const [level, setLevel] = useState<"Default" | "Medium" | "Full">("Default");

  useProKeys({ getIntent: () => plan?.tasks?.[1]?.order || null });

  async function onCheckchart() {
    const r = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol }),
    });
    setPlan(await r.json());
  }

  async function onAction(mode: string, intent: any) {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, intent }),
    });
  }

  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, Arial" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Trade Composer</h1>
      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol e.g. BTCUSD"
          style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8 }}
        />
        <button onClick={onCheckchart} style={{ padding: "8px 12px", borderRadius: 8, background: "black", color: "white" }}>
          Checkchart
        </button>
        <select value={level} onChange={e => setLevel(e.target.value as any)} style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8 }}>
            <option>Default</option>
            <option>Medium</option>
            <option>Full</option>
        </select>
      </div>

      {plan && (
        <section style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
          <div><b>Bias:</b> {plan.regime.bias}</div>
          <div style={{ opacity: 0.7, fontSize: 13 }}>
            Levels: {plan.levels.map((l: any) => `${l.type}@${l.price}`).join(", ")}
          </div>
          <div style={{ marginTop: 12 }}>
            <Dashboard level={level} onAction={onAction} intent={plan.tasks?.[1]?.order || null} />
          </div>
        </section>
      )}
    </main>
  );
}
