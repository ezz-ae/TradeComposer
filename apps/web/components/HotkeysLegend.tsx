
"use client";
export default function HotkeysLegend(){
  const row = (k:string, d:string)=>(
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
      <span style={{ opacity:.7 }}>{d}</span>
      <code style={{ background:'#F3F4F6', padding:'2px 6px', borderRadius:6 }}>{k}</code>
    </div>
  );
  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Hotkeys</div>
      <div style={{ display:'grid', gap:6 }}>
        {row('Shift+T','SEE → Test')}
        {row('Shift+P','SEE → Prioritize')}
        {row('Shift+R','SEE → Review')}
        {row('Shift+Enter','SEE → Force')}
        {row('Esc, Esc','Panic (clear UI state)')}
      </div>
    </div>
  );
}
