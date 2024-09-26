"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { logout } from "@/store/user/userSlice";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserMenuProps {
  userImage: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ userImage }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.delete("/api/users");
      if (response.status === 200) {
        dispatch(logout());
        router.push("/account/login");
      }
    } catch (error) {
      console.error("Đăng xuất thất bại: ", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src={userImage}
            alt="User Avatar"
            width={32}
            height={32}
            className="w-8 h-8 object-cover rounded-full cursor-pointer border-none outline-none focus:border-none focus:outline-none"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-48">
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/account/info">Cập nhật tài khoản</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMenu;
