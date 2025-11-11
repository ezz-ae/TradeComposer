
'use client';
import { useState } from 'react';
import AIOrchestrateButton from '@/app/components/AIOrchestrateButton';
import PlanCards from '@/app/components/PlanCards';
import PolicyPresetSwitcher from '@/app/components/PolicyPresetSwitcher';

export default function ComposerPage(){
  const [mode, setMode] = useState<'coins'|'tokens'|'memecoins'>('coins');
  const scope:any = { timeframe:'m15', venue:'spot', chain:'polygon', mode };
  const risk:any = { knobs:[{id:'slipCap', value: 10},{id:'killGap', value: 30}] };
  const symbol = mode==='memecoins' ? 'PEPEUSD' : mode==='tokens'? 'UNIUSD' : 'BTCUSD';

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontWeight:800, fontSize:22 }}>Composer · Modes</h1>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <button onClick={()=>setMode('coins')} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd' }}>Coins</button>
        <button onClick={()=>setMode('tokens')} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd' }}>Tokens</button>
        <button onClick={()=>setMode('memecoins')} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #ddd' }}>Memecoins</button>
      </div>

      <div style={{ marginTop:12 }}>
        <AIOrchestrateButton symbol={symbol} scope={scope} risk={risk.knobs} mode="prioritize" frameIndex={0} />
      </div>

      <div style={{ marginTop:12 }}>
        <PolicyPresetSwitcher riskKnobs={risk.knobs} scope={scope} />
      </div>

      {/* PlanCards expects a real plan; this page is a shell. Wire state from orchestrate response. */}
      {/* <PlanCards plan={plan} riskKnobs={risk.knobs} scope={scope} onAction={(m,t)=>console.log(m,t)} /> */}
    </div>
  );
}
