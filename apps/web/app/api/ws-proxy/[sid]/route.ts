import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest, ctx: any) {
  const { sid } = ctx.params;
  const api = process.env.PARTNER_API_URL || "http://localhost:8080";
  // @ts-ignore
  const [client, server]: [any, any] = Object.values(new WebSocketPair());
  server.accept();
  const upstream = new WebSocket(api.replace("http","ws") + `/ws/sessions/${sid}`);
  upstream.addEventListener("message", (ev: any) => server.send(ev.data));
  upstream.addEventListener("close", () => server.close());
  upstream.addEventListener("error", () => server.close());
  return new Response(null, { status: 101, webSocket: client } as any);
}
