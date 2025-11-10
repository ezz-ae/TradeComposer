import { NextRequest } from "next/server";

export const config = { runtime: "edge" };

export default async function handler(req: NextRequest, ctx: any) {
  const { sid } = ctx.params;
  const api = process.env.PARTNER_API_URL || "http://localhost:8080";
  // @ts-ignore
  const [client, server] = Object.values(new WebSocketPair());
  // @ts-ignore
  server.accept();
  const upstream = new WebSocket(api.replace("http","ws") + `/ws/sessions/${sid}`);
  upstream.addEventListener("message", (ev) => server.send(ev.data));
  upstream.addEventListener("close", () => server.close());
  upstream.addEventListener("error", () => server.close());
  return new Response(null, { status: 101, webSocket: client });
}
