
"use client";
import { useEffect, useMemo, useState } from 'react';
import { loadOrgPolicy, saveOrgPolicy, loadSessionConfig, saveSessionConfig, type OrgPolicy, type GateConfig } from '@/app/lib/policyPresets';
import { fetchOrgPolicy, saveOrgPolicyCloud, fetchSessionPolicy, saveSessionPolicyCloud, onOrgPolicy, onSessionPolicy } from '@/app/lib/policyCloud';

const CLOUD = String(process.env.NEXT_PUBLIC_ORG_CLOUD) === 'true';

export function useOrgCloudPolicy(orgId: string, sessionId?: string | null){
  const [org, setOrg] = useState<OrgPolicy>(loadOrgPolicy());
  const [session, setSession] = useState<GateConfig | null>(sessionId ? loadSessionConfig(sessionId) : null);
  const [live, setLive] = useState({ org:false, session:false });

  useEffect(()=>{
    if(!CLOUD){ return; }
    let unsubOrg: any = null; let unsubSess: any = null;
    unsubOrg = onOrgPolicy(orgId, p => { if(p){ setOrg(p); saveOrgPolicy(p); } setLive(l => ({...l, org:true})); });
    if(sessionId){
      unsubSess = onSessionPolicy(orgId, sessionId, s => { if(s){ setSession(s); saveSessionConfig(sessionId, s); } setLive(l => ({...l, session:true})); });
    }
    return ()=>{ if(unsubOrg) unsubOrg(); if(unsubSess) unsubSess(); };
  }, [orgId, sessionId]);

  async function setOrgPolicy(next: OrgPolicy){
    setOrg(next); saveOrgPolicy(next);
    if(CLOUD) await saveOrgPolicyCloud(orgId, next);
  }

  async function setSessionPolicy(next: GateConfig){
    if(!sessionId) return;
    setSession(next); saveSessionConfig(sessionId, next);
    if(CLOUD) await saveSessionPolicyCloud(orgId, sessionId, next);
  }

  return { org, session, setOrgPolicy, setSessionPolicy, cloud: CLOUD, live };
}
