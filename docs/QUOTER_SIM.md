
# Quoter Simulator

## API
`POST /api/sim/quote`
```json
{
  "side": "buy",
  "size_pct": 1.25,
  "slip_cap_bps": 8,
  "ttl_ms": 800,
  "equity_usd": 10000
}
```
**Response**
```json
{
  "ok": true,
  "status": "filled | partial | no_fill",
  "mid": 100.12,
  "vw_price": 100.19,
  "slip_bps": 7.1,
  "filled_pct": 0.83,
  "slip_cap_bps": 8,
  "ttl_ms": 800,
  "side": "buy",
  "size_usd": 125.0,
  "book": { "mid": 100.12, "bids": [[...]], "asks": [[...]] }
}
```

## UI
- In **Executor**, press **Simulate** to send the current intent.
- **Quoter Simulator** panel shows status, mid, VW price, slippage (bps), and filled %.
- Uses live mock mid from the tick engine; book is synthetic but realistic enough to test rails.
