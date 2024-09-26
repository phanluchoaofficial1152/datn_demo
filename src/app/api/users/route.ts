import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import AccountModels from "@/models/UserModels";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          message: "Thiếu thông tin xác thực, vui lòng kiểm tra lại.",
        }),
        {
          status: 401,
        }
      );
    }

    const decoded = jwt.verify(
      token,
      String(process.env.NEXT_PUBLIC_JWT_SECRET)
    ) as string | JwtPayload;

    if (typeof decoded !== "string" && decoded.userId) {
      const user = await AccountModels.findById(decoded.userId);

      if (!user) {
        return new NextResponse(
          JSON.stringify({ message: "Không tìm thấy user." }),
          {
            status: 404,
          }
        );
      }

      return new NextResponse(JSON.stringify(user), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Token không hợp lệ hoặc đã hết hạn." }),
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Đã xảy ra lỗi.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("access_token")?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          message: "Thiếu thông tin xác thực, vui lòng kiểm tra lại.",
        }),
        {
          status: 401,
        }
      );
    }

    const response = new NextResponse(
      JSON.stringify({ message: "Đăng xuất thành công." }),
      {
        status: 200,
      }
    );

    response.cookies.set("access_token", "", { path: "/", maxAge: 0 });

    return response;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Đã xảy ra lỗi.",
      }),
      {
        status: 500,
      }
    );
  }
}
