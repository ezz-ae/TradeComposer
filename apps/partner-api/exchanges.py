
import ccxt, time
from typing import Dict, Any

EX_ADAPTERS = {
    'binance': ccxt.binance,
    'okx': ccxt.okx,
    'bybit': ccxt.bybit
}

def make_exchange(kind: str, apiKey: str, secret: str, password: str|None=None, sandbox: bool=False):
    if kind not in EX_ADAPTERS:
        raise ValueError('unsupported exchange')
    cls = EX_ADAPTERS[kind]
    ex = cls({
        'apiKey': apiKey,
        'secret': secret,
        'password': password,
        'enableRateLimit': True,
        'options': { 'adjustForTimeDifference': True }
    })
    if sandbox and hasattr(ex, 'set_sandbox_mode'):
        ex.set_sandbox_mode(True)
    return ex

async def get_balances(ex) -> Dict[str, Any]:
    bal = await ex.fetch_balance()
    total = { k:v for k,v in (bal.get('total') or {}).items() if isinstance(v,(int,float)) and v>0 }
    return { 'info': bal.get('info'), 'total': total }

async def market_buy(ex, symbol: str, amount: float):
    # For derivatives vs spot this will differ; keep as spot for now
    o = await ex.create_market_buy_order(symbol, amount)
    return o

async def market_sell(ex, symbol: str, amount: float):
    o = await ex.create_market_sell_order(symbol, amount)
    return o
