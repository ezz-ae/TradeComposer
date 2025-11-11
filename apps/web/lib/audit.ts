
import { getFirebase } from '@/app/lib/firebase';

export type AuditEvent = {
  type: 'see.test'|'see.prioritize'|'see.review'|'see.force'|'policy.change'|'export.pack';
  orgId: string;
  sessionId?: string|null;
  who?: string|null;
  payload?: any;
  ts?: number;
};

export async function sendAudit(functionUrl: string, ev: AuditEvent){
  const { auth } = getFirebase();
  const user = auth.currentUser;
  const idToken = user ? await user.getIdToken() : null;
  const body = { ...ev, ts: ev.ts || Date.now(), who: ev.who || user?.uid || null };
  const r = await fetch(functionUrl, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {}) },
    body: JSON.stringify(body)
  });
  if(!r.ok){
    const t = await r.text();
    throw new Error(`audit_failed: ${r.status} ${t}`);
  }
  return await r.json();
}
