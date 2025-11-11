
"use client";
import { useAuthRole } from '@/app/lib/auth/role';

export default function AuthGate({ need='viewer', children }:{ need?: 'viewer'|'editor'|'admin', children: any }){
  const { role, loading } = useAuthRole();
  if(loading) return <div style={{ opacity:.6, fontSize:12 }}>auth…</div>;
  const rank = (r:string)=> r==='admin'?3 : r==='editor'?2 : r==='viewer'?1 : 0;
  return rank(role||'viewer') >= rank(need) ? children : <div style={{ fontSize:12, color:'#9CA3AF' }}>insufficient permissions</div>;
}
