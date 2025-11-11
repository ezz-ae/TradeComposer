
'use client';
import { useState } from 'react';
import { createPayment } from '@/app/lib/api';

export default function BillingPage(){
  const [orgId] = useState('demo-org');
  const [userId] = useState('demo-user');
  const [amount, setAmount] = useState(25);
  const [resp, setResp] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPay(){
    setError(null);
    try{
      const token = await (window as any)?.firebaseUser?.getIdToken?.();
      const r = await fetch((process.env.NEXT_PUBLIC_PARTNER_API_URL || 'http://localhost:8080') + '/api/payments/create', {
        method:'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ orgId, userId, amount, currency:'USDC', chain:'polygon', provider: process.env.NEXT_PUBLIC_PAYMENTS_PROVIDER || 'coinbase' })
      });
      if(!r.ok){ throw new Error('create_failed'); }
      const j = await r.json();
      setResp(j);
      if(j.hosted_url){ window.open(j.hosted_url, '_blank'); }
    }catch(e:any){
      setError(e?.message || 'payment_error');
    }
  }

  return (
    <div style={{ padding:16 }}>
      <h1>Billing</h1>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} style={{ padding:6, border:'1px solid #ddd', borderRadius:8 }} />
        <button onClick={onPay} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd' }}>Pay with Crypto</button>
      </div>
      {error && <div style={{ color:'crimson', marginTop:8 }}>{error}</div>}
      {resp && <pre style={{ marginTop:12 }}>{JSON.stringify(resp, null, 2)}</pre>}
      <p style={{ fontSize:12, opacity:.7, marginTop:12 }}>Webhooks will update payment status in Firestore.</p>
    </div>
  );
}
