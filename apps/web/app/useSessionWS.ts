"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_PARTNER_API_URL || "http://localhost:8080";

export function useSessionWS(sid="demo"){
  const [data, setData] = useState<{expected:number[], real:number[], confidence:number, r:number} | null>(null);
  useEffect(() => {
    const url = API.replace(/^http/, "ws") + `/ws/sessions/${sid}`;
    const ws = new WebSocket(url);
    ws.onmessage = (ev) => {
      try { setData(JSON.parse(ev.data)); } catch {}
    };
    return () => ws.close();
  }, [sid]);
  return data;
}
