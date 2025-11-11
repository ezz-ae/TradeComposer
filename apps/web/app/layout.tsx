
export const metadata = { title: 'TradeComposer' };
export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
