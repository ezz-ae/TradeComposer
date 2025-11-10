"use client";
import { useEffect, useState } from "react";

export function useSessionWS(sid="demo"){
  const [data, setData] = useState<{expected:number[], real:number[], confidence:number, r:number} | null>(null);
  useEffect(() => {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    const url = `${proto}://${location.host.replace(/:\d+$/,'')}:${location.port||location.host.split(':')[1]||3000}/api/ws-proxy/${sid}`;
    const ws = new WebSocket(url);
    ws.onmessage = (m)=>{ try { setData(JSON.parse(m.data)); } catch{} };
    return ()=>ws.close();
  }, [sid]);
  return data;
}
