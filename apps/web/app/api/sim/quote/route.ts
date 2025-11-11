
export async function POST(req: Request){
  const body = await req.json();
  const url = process.env.PARTNER_API_URL || process.env.NEXT_PUBLIC_PARTNER_API_URL || "http://localhost:8080";
  const r = await fetch(url + "/api/sim/quote",{method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const data = await r.text();
  return new Response(data, { headers:{'Content-Type':'application/json'} });
}
