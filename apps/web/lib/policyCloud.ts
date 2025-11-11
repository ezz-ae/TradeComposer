
/**
 * Firestore-backed org + session policy.
 * Collections:
 *  - orgs/{orgId}/policy (single doc: orgPolicy)
 *  - orgs/{orgId}/sessions/{sessionId}/policy (doc: session policy)
 *
 * Caller supplies orgId and sessionId. If env flag disabled or Firestore not configured,
 * callers should fallback to local storage functions from policyPresets.ts.
 */
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getFirebase } from '@/app/lib/firebase';
import type { OrgPolicy, GateConfig } from '@/app/lib/policyPresets';

export async function fetchOrgPolicy(orgId: string): Promise<OrgPolicy | null>{
  try{
    const { db } = getFirebase();
    const d = await getDoc(doc(db, 'orgs', orgId, 'policy', 'orgPolicy'));
    return d.exists() ? (d.data() as any) : null;
  }catch{ return null; }
}

export async function saveOrgPolicyCloud(orgId: string, policy: OrgPolicy){
  const { db } = getFirebase();
  await setDoc(doc(db, 'orgs', orgId, 'policy', 'orgPolicy'), policy, { merge: true });
}

export async function fetchSessionPolicy(orgId: string, sessionId: string): Promise<GateConfig | null>{
  try{
    const { db } = getFirebase();
    const d = await getDoc(doc(db, 'orgs', orgId, 'sessions', sessionId, 'policy'));
    return d.exists() ? (d.data() as any) : null;
  }catch{ return null; }
}

export async function saveSessionPolicyCloud(orgId: string, sessionId: string, cfg: GateConfig){
  const { db } = getFirebase();
  await setDoc(doc(db, 'orgs', orgId, 'sessions', sessionId, 'policy'), cfg, { merge: true });
}

// live listeners
export function onOrgPolicy(orgId: string, cb: (p: OrgPolicy | null)=>void){
  const { db } = getFirebase();
  const ref = doc(db, 'orgs', orgId, 'policy', 'orgPolicy');
  return onSnapshot(ref, snap => cb(snap.exists() ? (snap.data() as any) : null));
}
export function onSessionPolicy(orgId: string, sessionId: string, cb: (p: GateConfig | null)=>void){
  const { db } = getFirebase();
  const ref = doc(db, 'orgs', orgId, 'sessions', sessionId, 'policy');
  return onSnapshot(ref, snap => cb(snap.exists() ? (snap.data() as any) : null));
}
