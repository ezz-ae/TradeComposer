"use client";

import Grid from '../components/panels/Grid';
import { useSessionWS } from './useSessionWS';

export default function Page() {
  const data = useSessionWS();
  return (
    <main className="bg-gray-900 min-h-screen">
      <Grid />
    </main>
  );
}
