import { useEffect } from "react";

export function useProKeys(opts: { getIntent: () => any }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "p") act("prioritize");
      if (e.key === "r") act("review");
      if (e.key === "t") act("test");
      if (e.key === "f") act("force");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [opts.getIntent]);

  const act = (mode: string) =>
    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-role": "pro",
        "x-device-lease": "dev-lease-demo",
      },
      body: JSON.stringify({ mode, intent: opts.getIntent() }),
    });
}
