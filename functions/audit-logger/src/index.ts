
import { Hono } from 'hono';
import admin from 'firebase-admin';
import { BigQuery } from '@google-cloud/bigquery';

const app = new Hono();

// Lazy init admin
let inited = false;
function ensureAdmin(){
  if(!inited){
    admin.initializeApp();
    inited = true;
  }
}

type AuditEvent = {
  type: string;
  orgId: string;
  sessionId?: string|null;
  who?: string|null;
  payload?: any;
  ts?: number;
};

app.post('/audit', async (c) => {
  ensureAdmin();
  const auth = c.req.header('Authorization');
  let decoded: admin.auth.DecodedIdToken | null = null;
  if(auth && auth.startsWith('Bearer ')){
    const token = auth.substring('Bearer '.length);
    try { decoded = await admin.auth().verifyIdToken(token); } catch {}
  }

  const ev = await c.req.json<AuditEvent>();
  if(!ev?.orgId || !ev?.type){
    return c.text('missing orgId or type', 400);
  }

  // roles: require at least viewer
  if(!decoded || !['viewer','editor','admin'].includes((decoded as any)?.role)){
    return c.text('unauthorized', 401);
  }

  const bq = new BigQuery();
  const dataset = process.env.BQ_DATASET || 'tradecomposer';
  const table = process.env.BQ_TABLE || 'audit_events';
  const rows = [{
    type: ev.type,
    orgId: ev.orgId,
    sessionId: ev.sessionId || null,
    who: ev.who || (decoded?.uid || null),
    ts: new Date(ev.ts || Date.now()),
    payload: ev.payload || null
  }];

  await bq.dataset(dataset).table(table).insert(rows);
  return c.json({ ok: true });
});

// Export for Cloud Functions 2nd gen (Cloud Run functions)
export default app;
