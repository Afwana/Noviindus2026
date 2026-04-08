"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/utils/logout";

import Logo from "../../public/images/logo.png";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between w-full p-4">
      <div className="hidden md:block"></div>
      <div className="flex items-center justify-center w-48 h-[60px] relative">
        <Image src={Logo} alt="" fill objectFit="contain" />
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="btn w-[101px] h-[45px] rounded-lg bg-[#177A9C] text-white text-center cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
