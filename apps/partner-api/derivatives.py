
# (from v4.4) async ccxt helpers
import ccxt.async_support as ccxta

async def with_exchange(kind: str, creds, sandbox: bool, fn):
  cls = getattr(ccxta, kind)
  ex = cls({'apiKey': creds['apiKey'], 'secret': creds['secret'], 'password': creds.get('password') or None, 'enableRateLimit': True})
  if sandbox and hasattr(ex, 'set_sandbox_mode'): ex.set_sandbox_mode(True)
  try:
    return await fn(ex)
  finally:
    await ex.close()

async def fetch_positions(kind: str, creds, sandbox: bool):
  async def run(ex):
    if hasattr(ex, 'fetch_positions'): return await ex.fetch_positions()
    if hasattr(ex, 'fetch_balance'): return (await ex.fetch_balance({'type':'swap'})).get('info')
    return []
  return await with_exchange(kind, creds, sandbox, run)

async def set_leverage(kind: str, creds, sandbox: bool, symbol: str, leverage: int):
  async def run(ex):
    if hasattr(ex, 'set_leverage'): return await ex.set_leverage(leverage, symbol)
    return {'ok': False, 'reason': 'not_supported'}
  return await with_exchange(kind, creds, sandbox, run)

async def place_order(kind: str, creds, sandbox: bool, symbol: str, side: str, amount: float, reduce_only=False):
  params = {'reduceOnly': True} if reduce_only else {}
  async def run(ex):
    if side == 'buy': return await ex.create_market_buy_order(symbol, amount, params)
    return await ex.create_market_sell_order(symbol, amount, params)
  return await with_exchange(kind, creds, sandbox, run)
