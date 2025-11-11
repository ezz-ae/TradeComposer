
"use client";
import { useEffect, useState } from 'react';
import { getFirebase } from '@/app/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export type Role = 'admin'|'editor'|'viewer'|null;

export function useAuthRole(){
  const { auth } = getFirebase();
  const [role, setRole] = useState<Role>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    return onAuthStateChanged(auth, async (u)=>{
      setUser(u);
      if(!u){ setRole(null); setLoading(false); return; }
      try{
        const token = await u.getIdTokenResult(true);
        const r = (token?.claims as any)?.role || 'viewer';
        setRole(r);
      }catch{
        setRole('viewer');
      }finally{
        setLoading(false);
      }
    });
  }, [auth]);

  async function login(){
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }
  async function logout(){ await auth.signOut(); }

  return { role, user, loading, login, logout };
}
