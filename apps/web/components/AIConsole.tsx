
"use client";
import { useState } from 'react';

export default function AIConsole({ symbol='BTCUSD', scope, risk, plan }:{ symbol?:string; scope:any; risk:any; plan:any }){
  const [log, setLog] = useState<string>('');
  const [busy, setBusy] = useState(false);

  async function call(path:string, body:any){
    setBusy(true);
    try{
      const r = await fetch(path, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      const j = await r.json();
      setLog(l => l + '\n\n$ ' + path + '\n' + JSON.stringify(j, null, 2));
    }catch(e:any){
      setLog(l => l + '\n\n! ' + path + '\n' + (e?.message || 'error'));
    }finally{
      setBusy(false);
    }
  }

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontWeight:600 }}>AI Console</div>
        <div style={{ fontSize:12, opacity:.7 }}>{busy ? 'running…' : 'idle'}</div>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
        <button onClick={()=>call('/api/ai/plan', { symbol, scope })} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Plan</button>
        <button onClick={()=>call('/api/ai/reason', { symbol, mode:'force', plan, risk, scope, frameIndex:0 })} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Reason</button>
        <button onClick={()=>call('/api/ai/risk', { risk, scope })} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Risk Critique</button>
      </div>
      <pre style={{ marginTop:12, background:'#fafafa', border:'1px solid #eee', padding:12, borderRadius:8, maxHeight:280, overflow:'auto', fontSize:12 }}>{log || 'Outputs will appear here.'}</pre>
    </div>
  );
}
