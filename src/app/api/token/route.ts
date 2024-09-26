import { NextResponse } from "next/server";
import cookie from "cookie";

export async function GET(req: Request) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");

  const accessToken = cookies.access_token || null;

  return NextResponse.json({ access_token: accessToken });
}
