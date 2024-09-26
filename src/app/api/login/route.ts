import dbConnect from "@/lib/mongodb";
import AccountModels from "@/models/UserModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

interface TokenProps {
  userId: string;
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password, username } = await req.json();

    if ((!email && !username) || !password) {
      return new Response(
        JSON.stringify({
          message: "Email hoặc Tên người dùng và Mật khẩu là bắt buộc.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await AccountModels.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "Người dùng không tồn tại." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Mật khẩu không đúng." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const tokenProps: TokenProps = {
      userId: user._id.toString(),
    };

    const token = createToken(tokenProps);

    const response = new NextResponse(
      JSON.stringify({ message: "Đăng nhập thành công." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    response.headers.set(
      "Set-Cookie",
      `access_token=${token}; Path=/; Max-Age=${
        60 * 60 * 24 * 7
      }; HttpOnly; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Đã xảy ra lỗi.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function createToken({ userId }: TokenProps): string {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  return jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET as string, {
    algorithm: "HS512",
  });
}
