import { NextRequest, NextResponse } from "next/server";
import { getBackend } from "../_lib";

export async function GET(req: NextRequest) {
  const categories = req.nextUrl.searchParams.get("categories") || "";
  const res = await fetch(
    `${getBackend()}/api/admin/category-banners-bulk?categories=${encodeURIComponent(categories)}`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });
  response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return response;
}
