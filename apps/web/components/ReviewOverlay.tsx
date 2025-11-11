
"use client";
export default function ReviewOverlay({ intent, onClose, onSend, rails }:{ intent:any; onClose:()=>void; onSend:(mode:'test'|'prioritize'|'force', intent:any)=>void; rails:{ slipCapped:boolean; killHigh:boolean } }){
  if(!intent) return null;
  const forceBlocked = rails.slipCapped || rails.killHigh;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }} onClick={onClose}>
      <div style={{ width:620, background:'#fff', borderRadius:12, padding:16 }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:700, marginBottom:8 }}>Review Packet</div>
        <pre style={{ fontSize:12, background:'#fafafa', border:'1px solid #eee', padding:12, borderRadius:8, maxHeight:320, overflow:'auto' }}>
{JSON.stringify(intent, null, 2)}
        </pre>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
          <div style={{ fontSize:12, opacity:.8 }}>
            {rails.slipCapped && <span style={{ color:'#DC2626' }}>Slip capped by rails. </span>}
            {rails.killHigh && <span style={{ color:'#DC2626' }}>Kill gap high. </span>}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>onSend('test', intent)} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Test</button>
            <button onClick={()=>onSend('prioritize', intent)} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Prioritize</button>
            <button onClick={()=>!forceBlocked && onSend('force', intent)} disabled={forceBlocked}
              style={{ padding:'8px 12px', borderRadius:8, background: forceBlocked? '#9CA3AF':'#111827', color:'#fff' }}>Force</button>
          </div>
        </div>
      </div>
    </div>
  );
}
