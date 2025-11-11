
export async function GET(){
  const url = process.env.PARTNER_API_URL || process.env.NEXT_PUBLIC_PARTNER_API_URL || "http://localhost:8080";
  const r = await fetch(url + "/api/queue");
  const data = await r.text();
  return new Response(data, { headers:{'Content-Type':'application/json'} });
}
export async function POST(req: Request){
  const url = process.env.PARTNER_API_URL || process.env.NEXT_PUBLIC_PARTNER_API_URL || "http://localhost:8080";
  const body = await req.json();
  const r = await fetch(url + "/api/queue",{ method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  const data = await r.text();
  return new Response(data, { headers:{'Content-Type':'application/json'} });
}
