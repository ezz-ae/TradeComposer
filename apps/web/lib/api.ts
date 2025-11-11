
export async function api(path:string, opts:any={}){
  const base = process.env.NEXT_PUBLIC_PARTNER_API_URL || 'http://localhost:8080';
  const r = await fetch(`${base}${path}`, { ...opts, headers: { 'Content-Type':'application/json', ...(opts.headers||{}) }});
  if(!r.ok){ throw new Error(`api_failed ${r.status}`); }
  return await r.json();
}

export async function createPayment(userId:string, amount:number, currency='USDC', chain='polygon', provider=process.env.NEXT_PUBLIC_PAYMENTS_PROVIDER||'coinbase'){
  return api('/api/payments/create', { method:'POST', body: JSON.stringify({ userId, amount, currency, chain, provider }) });
}
