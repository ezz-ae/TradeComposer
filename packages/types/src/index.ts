export type Leg = {
  id: string;
  type: "call" | "put";
  side: "buy" | "sell";
  quantity: number;
  strike: number;
  premium: number;
};

export type Strategy = {
  id: string;
  name: string;
  legs: Leg[];
};

export type Order = {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
};
