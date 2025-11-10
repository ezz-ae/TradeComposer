import { NextResponse } from 'next/server';
import { Order } from '@packages/types';

const orders: Order[] = [
  { id: '1', symbol: 'BTC/USD', side: 'buy', amount: 1, price: 50000 },
  { id: '2', symbol: 'ETH/USD', side: 'sell', amount: 10, price: 2000 },
];

export async function GET() {
  return NextResponse.json(orders);
}
