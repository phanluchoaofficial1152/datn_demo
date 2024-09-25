"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateUserImage } from "@/store/user/userSlice";
import UserMenu from "./UserMenu";

const Headers = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const userImage = useSelector((state: RootState) => state.user.userImage);

  const fetchToken = async () => {
    const cookiesToken = Cookies.get("access_token");

    if (cookiesToken) {
      try {
        const decodedToken = jwt.decode(cookiesToken) as { userId?: string };

        if (decodedToken?.userId) {
          try {
            const response = await axios.get(
              `/api/users/${decodedToken.userId}`
            );

            const userData = response.data;

            dispatch(updateUserImage(userData.images));
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
          error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý."
        );
      }
    } else {
      toast.dismiss("");
    }
  };

  useEffect(() => {
    fetchToken();
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header
      className="bg-white dark:bg-[#0C0C0E] dark:text-white shadow-md sticky w-full px-6 md:px-16 z-50"
      suppressHydrationWarning={true}
    >
      <div className="flex items-center justify-between py-4">
        <Link href="/">
          <div className="text-2xl font-bold">MUSICMALL</div>
        </Link>

        <nav className="space-x-6 text-md hidden sm:hidden md:hidden lg:flex">
          <Link
            href="/"
            className="hover:text-gray-700 dark:hover:text-slate-300"
          >
            Trang chủ
          </Link>
          <Link
            href="/san-pham"
            className="hover:text-gray-700 dark:hover:text-slate-300"
          >
            Sản phẩm
          </Link>
          <Link
            href="/lien-he"
            className="hover:text-gray-700 dark:hover:text-slate-300"
          >
            Liên hệ
          </Link>
        </nav>

        <div className="hidden md:flex items-center">
          <Input placeholder="Tìm kiếm..." className="mr-4" />
          <Button variant="ghost">
            <SearchIcon className="h-5 w-5 text-gray-500 dark:text-white" />
          </Button>
        </div>

        <div className="flex space-x-3 border-none outline-none focus:border-none focus:outline-none">
          <Button variant="ghost">
            <ShoppingCartIcon className="h-5 w-5 text-gray-700 dark:text-white" />
          </Button>
          <Button variant="ghost">
            {userImage ? (
              <div className="border-none outline-none focus:border-none focus:outline-none">
                <UserMenu userImage={userImage} />
              </div>
            ) : (
              <Link href="/account/login">
                <UserIcon className="h-5 w-5 text-gray-700 dark:text-white" />
              </Link>
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="flex sm:flex md:flex lg:hidden"
          onClick={toggleMenu}
        >
          <div
            className={`transform transition-all duration-300 ease-in-out ${
              menuOpen ? "rotate-180 opacity-100" : "rotate-0 opacity-100"
            }`}
          >
            {menuOpen ? (
              <AlignJustify className="h-6 w-6 text-gray-700 dark:text-white" />
            ) : (
              <AlignRight className="h-6 w-6 text-gray-700 dark:text-white" />
            )}
          </div>
        </Button>
      </div>

      {menuOpen && (
        <div className="flex sm:flex md:flex lg:hidden bg-white dark:bg-[#0C0C0E] dark:text-white w-full absolute left-0 top-full shadow-lg transition-transform duration-300 ease-in-out">
          <nav className="flex flex-col space-y-3 py-4 px-6 w-full text-center">
            <div className="border-t border-gray-300 dark:border-white"></div>

            <Link
              href="/"
              className="hover:text-gray-700 dark:hover:text-slate-300 py-2"
            >
              Trang chủ
            </Link>
            <Link
              href="/san-pham"
              className="hover:text-gray-700 dark:hover:text-slate-300 py-2"
            >
              Sản phẩm
            </Link>
            <Link
              href="/lien-he"
              className="hover:text-gray-700 dark:hover:text-slate-300 py-2"
            >
              Liên hệ
            </Link>

            <div className="border-t border-gray-300 dark:border-white my-4"></div>

            <div className="flex items-center">
              <Input placeholder="Tìm kiếm..." className="mr-2 flex-1" />
              <Button variant="ghost">
                <SearchIcon className="h-5 w-5 text-gray-500 dark:text-white" />
              </Button>
            </div>

            <hr />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Headers;
