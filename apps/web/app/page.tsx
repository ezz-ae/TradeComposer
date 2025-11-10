'use client';

import { useEffect, useState } from 'react';
import { Order } from '@packages/types';
import ScopeCanvas from '../components/ScopeCanvas';
import { useSessionWS } from '../lib/useSessionWS';

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const live = useSessionWS("demo");

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <h1>Trade Composer</h1>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
      {live && (
        <section style={{ marginTop: 16 }}>
          <div style={{ fontWeight:600, marginBottom:8 }}>Scope — Expected (dashed) vs Real (solid)</div>
          <ScopeCanvas expected={live.expected} real={live.real} />
          <div style={{ fontSize:12, opacity:.7, marginTop:6 }}>
            Confidence: {(live.confidence*100).toFixed(0)}% • R(t): {(live.r*100).toFixed(0)}%
          </div>
        </section>
      )}
    </div>
  );
}
