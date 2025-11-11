
export function planPromptByMode(mode:'coins'|'tokens'|'memecoins', symbol:string, scope:any){
  const base = `You are TradeComposer SEE planner. Output JSON matching SeePlanZ.`;
  if(mode==='coins'){
    return `${base}\nFocus on top-liquidity centralized exchange spot pairs. Symbol=${symbol}. Scope=${JSON.stringify(scope)}`;
  }
  if(mode==='tokens'){
    return `${base}\nFocus on DeFi blue-chip tokens across multiple venues; emphasize liquidity and depth. Symbol=${symbol}. Scope=${JSON.stringify(scope)}`;
  }
  return `${base}\nFocus on high-volatility memecoins; enforce tight risk and micro-targets; avoid illiquid traps. Symbol=${symbol}. Scope=${JSON.stringify(scope)}`;
}
