"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, updateUserImage } from "@/store/user/userSlice";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailOrUsername,
          password,
          username: emailOrUsername,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const fetchToken = async () => {
          const cookiesToken = Cookies.get("access_token");

          if (cookiesToken) {
            try {
              const decodedToken = jwt.decode(cookiesToken) as {
                userId?: string;
              };

              if (decodedToken?.userId) {
                try {
                  const response = await axios.get(
                    `/api/users/${decodedToken.userId}`
                  );

                  const userData = response.data;

                  dispatch(updateUserImage(userData.images));
                  dispatch(login(userData.images));
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "Đã xảy ra lỗi."
                  );
                }
              } else {
                toast.error("user này không tồn tại.");
              }
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Đã xảy ra lỗi khi xử lý."
              );
            }
          } else {
            toast.error("Thông tin xác thực không hợp lệ.");
          }
        };

        fetchToken();
        toast.success(data.message);

        setTimeout(() => {
          router.push("/");
        }, 500);
      }

      if (!response.ok) {
        toast.error("Đã xảy ra lỗi ...");
        console.log(data.message);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Đã xảy ra lỗi."
      );
      setIsErrorVisible(true);
      setFadeOut(false);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsErrorVisible(false);
        }, 450);
      }, 3000);
    }
  };

  return (
    <>
      <title>Đăng nhập tài khoản - MUSIC MALL</title>

      <div className="flex items-center min-h-screen justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-lg rounded-lg">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Đăng Nhập Tài Khoản
          </h2>
          {isErrorVisible && errorMessage && (
            <div
              className={`transition-opacity duration-500 ${
                fadeOut ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="text-red-500 text-center font-bold text-md">
                {errorMessage}
              </div>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="emailusername"
                className="block text-sm font-medium text-gray-700"
              >
                Email hoặc Tên người dùng
              </label>
              <Input
                id="emailusername"
                name="emailusername"
                type="text"
                required
                className="mt-1 w-full"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ghi nhớ
                </label>
              </div>
              <div className="text-sm">
                <Link
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quên mật khẩu
                </Link>
              </div>
            </div>
            <div>
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </div>
          </form>
          <p className="mt-2 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              href="/account/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
