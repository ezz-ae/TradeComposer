
'use client';
import Link from 'next/link';
import AuthGate from '@/app/components/AuthGate';
import WalletBar from '@/app/components/WalletBar';

export default function Nav(){
  return (
    <div style={{ borderBottom:'1px solid #eee', padding:12 }}>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/connections">Connections</Link>
        <Link href="/dashboard/billing">Billing</Link>
        <Link href="/composer">Composer</Link>
        <AuthGate need="editor"><Link href="/composer/derivatives">Derivatives</Link></AuthGate>
        <Link href="/gemini">Gemini</Link>
        <div style={{ marginLeft:'auto' }}><WalletBar /></div>
      </div>
    </div>
  );
}
