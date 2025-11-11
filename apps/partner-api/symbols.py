
# (from v4.4) normalize_symbol
def normalize_symbol(sym: str) -> str:
  s = (sym or '').upper().strip().replace('-', '/')
  if '/' not in s:
    for q in ['USDT','USD','USDC','BTC','ETH']:
      if s.endswith(q):
        base = s[:-len(q)]
        if base: return f"{base}/{q}"
  return s
