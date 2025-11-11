
"use client";
import { useEffect, useMemo, useState } from "react";
import { idbGet, idbSet } from "../lib/idb";

type JItem = any;

export function useJournal(){
  const [items, setItems] = useState<JItem[]>([]);
  const [replay, setReplay] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);

  useEffect(()=>{
    (async ()=>{
      try{ const saved = await idbGet('journal','items'); if(saved) setItems(saved); }catch{}
    })();
  }, []);

  useEffect(()=>{
    (async ()=>{
      try{ await idbSet('journal','items', items.slice(-2000)); }catch{}
    })();
  }, [items]);

  function push(it: JItem){ setItems(prev => [...prev, it]); }
  function exportJSON(){
    const blob = new Blob([JSON.stringify({ items }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'trade-composer-session.tcpack.json';
    a.click(); URL.revokeObjectURL(a.href);
  }

  return { items, push, exportJSON, replay, setReplay, replayIndex, setReplayIndex };
}
