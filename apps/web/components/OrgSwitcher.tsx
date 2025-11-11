
"use client";
import { useEffect, useState } from 'react';
import { getFirebase } from '@/app/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const KEY = 'tc.org.current';

export default function OrgSwitcher({ onChange }:{ onChange:(orgId:string)=>void }){
  const { db } = getFirebase();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [active, setActive] = useState<string>(typeof window !== 'undefined' ? (localStorage.getItem(KEY) || '') : '');

  useEffect(()=>{
    (async()=>{
      try{
        const snap = await getDocs(collection(db, 'orgs'));
        const rows = snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
        setOrgs(rows);
        if(!active && rows[0]){
          setActive(rows[0].id);
          localStorage.setItem(KEY, rows[0].id);
          onChange(rows[0].id);
        }
      }catch{}
    })();
  }, []);

  useEffect(()=>{
    if(active){
      localStorage.setItem(KEY, active);
      onChange(active);
    }
  }, [active]);

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <div style={{ fontSize:12, opacity:.7 }}>Org</div>
      <select value={active} onChange={e=>setActive(e.target.value)} style={{ padding:'6px 8px', border:'1px solid #ddd', borderRadius:8 }}>
        {orgs.map(o => <option key={o.id} value={o.id}>{o.name || o.id}</option>)}
      </select>
    </div>
  );
}
