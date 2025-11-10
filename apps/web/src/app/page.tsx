'use client';

import { useEffect, useState } from 'react';
import { Order } from '@packages/types';

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div>
      <h1>Trade Composer</h1>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
}
