import dbConnect from "@/lib/mongodb";
import AccountModels from "@/models/UserModels";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface TokenProps {
  userId: string;
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password, username } = await req.json();

    if ((!email && !username) || !password) {
      return NextResponse.json(
        { message: "Email hoặc Tên người dùng và Mật khẩu là bắt buộc." },
        { status: 400 }
      );
    }

    const user = await AccountModels.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return NextResponse.json(
        { message: "Người dùng không tồn tại." },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Mật khẩu không đúng." },
        { status: 401 }
      );
    }

    const tokenProps: TokenProps = {
      userId: user._id.toString(),
    };

    const token = createToken(tokenProps);

    const res = NextResponse.json(
      { message: "Đăng nhập thành công." },
      { status: 200 }
    );

    res.cookies.set("access_token", token, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Đã xảy ra lỗi." },
      { status: 500 }
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
