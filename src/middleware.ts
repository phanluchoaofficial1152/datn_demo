import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Xác minh token thất bại: ", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  if (token) {
    const payload = await verifyToken(token);

    if (payload && typeof payload.userId === "string") {
      if (pathname === "/account/register" || pathname === "/account/login") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    const redirectResponse = NextResponse.redirect(
      new URL("/account/login", req.url)
    );
    redirectResponse.cookies.delete("access_token");
    return redirectResponse;
  }

  if (pathname === "/account/register" || pathname === "/account/login") {
    return NextResponse.next();
  }

  if (
    pathname === "/" ||
    (pathname.startsWith("/account") &&
      pathname !== "/account/register" &&
      pathname !== "/account/login")
  ) {
    return NextResponse.redirect(new URL("/account/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/account/register", "/account/login", "/account/:path*"],
};
