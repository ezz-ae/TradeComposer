
export async function POST(req: Request){
  const body = await req.json();
  const url = process.env.PARTNER_API_URL || "http://localhost:8080";
  const r = await fetch(url + `/api/sessions/demo/orders`,
    {method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const text = await r.text();
  return new Response(text, { headers:{'Content-Type':'application/json'} });
}
