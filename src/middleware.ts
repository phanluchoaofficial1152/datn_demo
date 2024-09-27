import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";
import { importSPKI } from "jose";

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const publicKey = await importSPKI(
      process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!,
      "ES512"
    );

    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ["ES512"],
    });

    return payload;
  } catch (err) {
    console.error("Xác minh token thất bại: ", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname === "/account/register" || pathname === "/account/login") {
    if (!token) {
      return NextResponse.next();
    } else {
      const payload = await verifyToken(token);
      if (payload && typeof payload.userId === "string") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  if (token) {
    const payload = await verifyToken(token);

    if (payload && typeof payload.userId === "string") {
      return NextResponse.next();
    }

    const redirectResponse = NextResponse.redirect(
      new URL("/account/login", req.url)
    );
    redirectResponse.cookies.delete("access_token");
    return redirectResponse;
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
