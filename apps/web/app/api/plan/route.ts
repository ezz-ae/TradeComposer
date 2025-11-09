
export async function POST(req: Request){
  const body = await req.json();
  const url = process.env.PARTNER_API_URL || "http://localhost:8080";
  const r = await fetch(url + "/api/plan",{method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const data = await r.json();
  return new Response(JSON.stringify(data), { headers:{'Content-Type':'application/json'} });
}
