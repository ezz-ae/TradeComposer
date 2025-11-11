
export async function linkExchange(token: string, payload: any){
  const base = process.env.NEXT_PUBLIC_PARTNER_API_URL || 'http://localhost:8080';
  const r = await fetch(base + '/api/exchanges/link', {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  if(!r.ok) throw new Error('link_failed');
  return await r.json();
}
export async function listConnections(token: string, orgId: string, uid: string){
  const base = process.env.NEXT_PUBLIC_PARTNER_API_URL || 'http://localhost:8080';
  const r = await fetch(base + `/api/exchanges/${orgId}/${uid}`, {
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  if(!r.ok) throw new Error('list_failed');
  return await r.json();
}
export async function fetchBalances(token: string, orgId: string, uid: string, connId: string){
  const base = process.env.NEXT_PUBLIC_PARTNER_API_URL || 'http://localhost:8080';
  const r = await fetch(base + `/api/exchanges/${orgId}/${uid}/${connId}/balances`, {
    headers:{ 'Authorization': `Bearer ${token}` }
  });
  if(!r.ok) throw new Error('balances_failed');
  return await r.json();
}
