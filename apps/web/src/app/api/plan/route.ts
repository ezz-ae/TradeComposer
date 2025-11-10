import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { order } = body;

  // Here you would have your business logic to create a plan based on the order.
  // For this example, we'll just return a mock plan.

  const plan = {
    id: 'plan-1',
    orderId: order.id,
    steps: [
      { id: 'step-1', action: 'execute-trade', details: 'Execute trade for BTC/USD' },
      { id: 'step-2', action: 'notify-user', details: 'Notify user of trade execution' },
    ],
  };

  return NextResponse.json(plan);
}
