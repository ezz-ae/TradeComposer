
'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletBar(){
  return (
    <div style={{ display:'flex', justifyContent:'flex-end', padding:8 }}>
      <ConnectButton />
    </div>
  );
}
