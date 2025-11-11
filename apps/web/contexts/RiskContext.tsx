
"use client";
import { createContext, useContext, useMemo, useState } from "react";

export type RiskKnob = { id:string; label:string; min:number; max:number; step:number; value:number };

type CtxType = {
  knobs: RiskKnob[];
  set: (id:string, v:number)=>void;
  R: number;
};

const RiskCtx = createContext<CtxType | null>(null);

export function RiskProvider({ children }:{ children: React.ReactNode }){
  const [knobs, setKnobs] = useState<RiskKnob[]>([
    { id:"traction",   label:"Traction",   min:0.5, max:1.8, step:0.01, value:1.0 },
    { id:"confGain",   label:"Conf Gain",  min:0.5, max:1.5, step:0.01, value:1.0 },
    { id:"volDamp",    label:"Vol Damp",   min:0.5, max:1.2, step:0.01, value:1.0 },
    { id:"wickGuard",  label:"Wick Guard", min:0.6, max:1.0, step:0.01, value:1.0 },
    { id:"slipCap",    label:"Slip Cap (bps)", min:4, max:20, step:1, value:8 },
    { id:"killGap",    label:"Kill Gap (bps)", min:10, max:50, step:1, value:25 },
    { id:"ttl",        label:"TTL (ms)",   min:400, max:1500, step:50, value:800 }
  ]);
  const set = (id:string, v:number)=> setKnobs(prev => prev.map(k=>k.id===id?{...k, value:v}:k));
  const R = useMemo(()=>{
    const g = Object.fromEntries(knobs.map(k=>[k.id,k.value]));
    let r = 0.5 * g.traction * g.confGain * g.volDamp * g.wickGuard;
    r = Math.max(0.1, Math.min(1.2, r));
    return r;
  }, [knobs]);
  return <RiskCtx.Provider value={{ knobs, set, R }}>{children}</RiskCtx.Provider>;
}

export function useRisk(){
  const ctx = useContext(RiskCtx);
  if(!ctx) throw new Error("RiskProvider missing");
  return ctx;
}
