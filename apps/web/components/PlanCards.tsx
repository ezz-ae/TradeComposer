
"use client";
import { useMemo } from 'react';
import type { SeePlan } from '@/app/lib/ai/strict';
import { usePolicyGate } from '@/app/hooks/usePolicyGate';

type Props = {
  plan: SeePlan;
  riskKnobs: any[];
  scope: any;
  onAction: (mode:'test'|'prioritize'|'review'|'force', task:any)=>void;
};

export default function PlanCards({ plan, riskKnobs, scope, onAction }: Props){
  const primary = useMemo(()=> plan.tasks.find(t=>t.id?.toUpperCase?.().startsWith('OP-')) || plan.tasks[0], [plan]);
  const others = useMemo(()=> plan.tasks.filter(t=>t!==primary), [plan, primary]);

  const { decision, loading } = usePolicyGate(riskKnobs, scope);

  function CtaGroup({task}:{task:any}){
    const disabled = decision.blockForce;
    return (
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8 }}>
        <button onClick={()=>onAction('test', task)} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Test</button>
        <button onClick={()=>onAction('prioritize', task)} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Prioritize</button>
        <button onClick={()=>onAction('review', task)} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Review</button>
        <button onClick={()=>onAction('force', task)} disabled={disabled} title={disabled ? (decision.reasons.join(' • ') || 'Blocked by policy') : ''}
          style={{ padding:'6px 10px', borderRadius:8, background: disabled? '#9CA3AF':'#111827', color:'#fff' }}>
          Force
        </button>
      </div>
    );
  }

  function Card({task, highlight=false}:{task:any; highlight?:boolean}){
    return (
      <div style={{ border:'1px solid #eee', borderRadius:12, padding:12, background: highlight? '#FAFAFF':'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontWeight:600 }}>{task.id} · {task.type.toUpperCase()}</div>
          <div style={{ fontSize:12, opacity:.7 }}>prio: {task.priority}</div>
        </div>
        <div style={{ marginTop:6 }}>{task.desc}</div>
        {task.trigger && <pre style={{ marginTop:8, fontSize:12, background:'#fafafa', border:'1px solid #eee', padding:8, borderRadius:8 }}>{JSON.stringify(task.trigger, null, 2)}</pre>}
        {task.order && <pre style={{ marginTop:8, fontSize:12, background:'#fafafa', border:'1px solid #eee', padding:8, borderRadius:8 }}>{JSON.stringify(task.order, null, 2)}</pre>}
        <CtaGroup task={task} />
      </div>
    );
  }

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:700 }}>SEE Plan</div>
        <div style={{ fontSize:12, opacity:.7 }}>{loading ? 'policy: …' : (decision.blockForce ? 'policy: FORCE blocked' : 'policy: ok')}</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12, marginTop:12 }}>
        {primary && <Card task={primary} highlight />}
        {others.map((t:any)=> <Card key={t.id} task={t} />)}
      </div>

      {(decision.reasons.length || decision.warnings.length || decision.info.length) && (
        <div style={{ marginTop:12, fontSize:12 }}>
          {decision.reasons.length>0 && <div style={{ color:'#DC2626' }}><b>Blocked</b>: {decision.reasons.join(' • ')}</div>}
          {decision.warnings.length>0 && <div style={{ color:'#D97706' }}><b>Warnings</b>: {decision.warnings.join(' • ')}</div>}
          {decision.info.length>0 && <div style={{ color:'#374151' }}><b>Info</b>: {decision.info.join(' • ')}</div>}
        </div>
      )}
    </div>
  );
}
