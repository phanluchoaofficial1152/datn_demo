import dbConnect from "@/lib/mongodb";
import AccountModels from "@/models/UserModels";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, name, password, username, images } = await req.json();

    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { message: "Họ tên, Email, Mật khẩu, và Tên người dùng là bắt buộc." },
        { status: 400 }
      );
    }

    const existingUserByEmail = await AccountModels.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "Email đã tồn tại." },
        { status: 409 }
      );
    }

    const existingUserByName = await AccountModels.findOne({ name });
    if (existingUserByName) {
      return NextResponse.json({ message: "Tên đã tồn tại." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new AccountModels({
      email,
      name,
      password: hashedPassword,
      username,
      images,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Tài khoản đã được tạo thành công." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Đã xảy ra lỗi." },
      { status: 500 }
    );
  }
}
