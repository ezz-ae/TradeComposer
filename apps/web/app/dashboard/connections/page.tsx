
'use client';
import { useEffect, useState } from 'react';
import { linkExchange, listConnections, fetchBalances } from '@/app/lib/connectors';

export default function ConnectionsPage(){
  const [orgId] = useState('demo-org');
  const [uid] = useState('demo-user');
  const [kind, setKind] = useState('binance');
  const [label, setLabel] = useState('My Binance');
  const [apiKey, setApiKey] = useState('');
  const [secret, setSecret] = useState('');
  const [password, setPassword] = useState('');
  const [sandbox, setSandbox] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [balances, setBalances] = useState<any|null>(null);
  const [err, setErr] = useState<string|null>(null);

  const tokenPromise = async ()=> await (window as any)?.firebaseUser?.getIdToken?.();

  async function refresh(){
    setErr(null);
    try{
      const token = await tokenPromise();
      const r = await listConnections(token, orgId, uid);
      setItems(r);
    }catch(e:any){ setErr(e?.message || 'list_failed'); }
  }
  useEffect(()=>{ refresh(); }, []);

  async function onLink(){
    setErr(null);
    try{
      const token = await tokenPromise();
      await linkExchange(token, { orgId, userId: uid, kind, label, apiKey, secret, password, sandbox });
      setApiKey(''); setSecret(''); setPassword('');
      await refresh();
    }catch(e:any){ setErr(e?.message || 'link_failed'); }
  }

  async function onBalances(id:string){
    setErr(null);
    try{
      const token = await tokenPromise();
      const r = await fetchBalances(token, orgId, uid, id);
      setBalances(r);
    }catch(e:any){ setErr(e?.message || 'balances_failed'); }
  }

  return (
    <div style={{ padding:16 }}>
      <h1>Connections</h1>
      {err && <div style={{ color:'crimson' }}>{err}</div>}
      <div style={{ border:'1px solid #eee', borderRadius:12, padding:12, marginBottom:12 }}>
        <div style={{ display:'grid', gap:8, gridTemplateColumns:'repeat(2,1fr)' }}>
          <label>Exchange
            <select value={kind} onChange={e=>setKind(e.target.value)}>
              <option>binance</option><option>okx</option><option>bybit</option>
            </select>
          </label>
          <label>Label <input value={label} onChange={e=>setLabel(e.target.value)} /></label>
          <label>API Key <input value={apiKey} onChange={e=>setApiKey(e.target.value)} /></label>
          <label>Secret <input value={secret} onChange={e=>setSecret(e.target.value)} /></label>
          <label>Password/Passphrase <input value={password} onChange={e=>setPassword(e.target.value)} /></label>
          <label><input type="checkbox" checked={sandbox} onChange={e=>setSandbox(e.target.checked)} /> Sandbox</label>
        </div>
        <button onClick={onLink} style={{ marginTop:8 }}>Link</button>
      </div>

      <h3>Linked</h3>
      <ul>
        {items.map(x => (
          <li key={x.id} style={{ marginBottom:8 }}>
            {x.label} ({x.kind}) — <button onClick={()=>onBalances(x.id)}>Balances</button>
          </li>
        ))}
      </ul>

      {balances && <pre style={{ marginTop:12 }}>{JSON.stringify(balances, null, 2)}</pre>}
    </div>
  );
}
