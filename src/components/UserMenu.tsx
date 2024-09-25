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

interface UserMenuProps {
  userImage: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ userImage }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());

    setTimeout(() => {
      router.push("/account/login");
    }, 100);
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
          <DropdownMenuItem>
            <Link href="/account/info">Cập nhật tài khoản</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="cursor-pointer" onClick={handleLogout}>
              Đăng xuất
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMenu;
