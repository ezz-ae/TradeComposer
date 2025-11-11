
export async function PATCH(_req: Request, { params }:{ params:{ id:string } }){
  const url = process.env.PARTNER_API_URL || process.env.NEXT_PUBLIC_PARTNER_API_URL || "http://localhost:8080";
  const r = await fetch(url + "/api/queue/" + params.id, { method:"PATCH", headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action: "promote" }) });
  const data = await r.text();
  return new Response(data, { headers:{'Content-Type':'application/json'} });
}
