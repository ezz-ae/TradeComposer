
export async function POST(req: Request){
  const body = await req.json();
  const url = process.env.PARTNER_API_URL || process.env.NEXT_PUBLIC_PARTNER_API_URL || "http://localhost:8080";
  const role = process.env.PARTNER_API_ROLE || process.env.NEXT_PUBLIC_PARTNER_API_ROLE || "pro";
  const lease = process.env.PARTNER_API_DEVICE_LEASE || process.env.NEXT_PUBLIC_PARTNER_API_DEVICE_LEASE || "dev-lease-demo";
  const r = await fetch(url + "/api/sessions/demo/orders", {
    method: "POST",
    headers: { "Content-Type":"application/json", "x-role": role, "x-device-lease": lease },
    body: JSON.stringify(body)
  });
  const data = await r.text();
  return new Response(data, { status: r.status, headers:{'Content-Type':'application/json'} });
}
