
export const metadata = { title: "Trade Composer", description: "Moog-style trading instrument" };
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (<html lang="en"><body>{children}</body></html>);
}
