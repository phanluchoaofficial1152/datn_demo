import dbConnect from "@/lib/mongodb";
import AccountModels from "@/models/UserModels";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();

    const user = await AccountModels.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy user." },
        { status: 404 }
      );
    }

    return NextResponse.json({ images: user.images }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Đã xảy ra lỗi." },
      { status: 500 }
    );
  }
}
