
"use client";
export default function ReplayScrubber({ total, index, onChange }:{ total:number; index:number; onChange:(i:number)=>void }){
  if(total<=1) return null;
  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Replay</div>
      <input type="range" min={0} max={total-1} value={index} onChange={e=>onChange(parseInt(e.target.value))} style={{ width:'100%' }} />
      <div style={{ fontSize:12, opacity:.7, marginTop:6 }}>Frame {index+1}/{total}</div>
    </div>
  );
}
