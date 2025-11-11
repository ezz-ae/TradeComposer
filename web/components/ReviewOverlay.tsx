
"use client";
export default function ReviewOverlay({ intent, onClose }:{ intent:any; onClose:()=>void }){
  if(!intent) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000 }} onClick={onClose}>
      <div style={{ width:560, background:'#fff', borderRadius:12, padding:16 }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:700, marginBottom:8 }}>Review Packet</div>
        <pre style={{ fontSize:12, background:'#fafafa', border:'1px solid #eee', padding:12, borderRadius:8, maxHeight:320, overflow:'auto' }}>
{JSON.stringify(intent, null, 2)}
        </pre>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:10 }}>
          <button onClick={onClose} style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'#fff' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
