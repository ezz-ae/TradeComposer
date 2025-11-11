
'use client';
import AIConsole from '@/app/components/AIConsole';

export default function GeminiPage(){
  const symbol = 'BTCUSD';
  const scope:any = { timeframe:'m15', venue:'spot', chain:'polygon' };
  const risk:any = { knobs:[{id:'slipCap', value: 10},{id:'killGap', value: 30}] };
  const plan:any = null;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontWeight:800, fontSize:22 }}>Gemini Task Center</h1>
      <p>Run plan, reason, risk, and orchestration. Use outputs to feed Composer/Executor.</p>
      <AIConsole symbol={symbol} scope={scope} risk={risk.knobs} plan={plan} />
    </div>
  );
}
