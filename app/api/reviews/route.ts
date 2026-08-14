import { NextRequest, NextResponse } from "next/server";
import { getBackend } from "../admin/_lib";

export async function GET() {
  const res = await fetch(`${getBackend()}/api/admin/reviews`, { next: { revalidate: 1800 } });
  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });
  response.headers.set("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600");
  return response;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${getBackend()}/api/admin/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
