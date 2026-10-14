"use client";

import { adminLogout } from "@/actions/adminActions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogoutBtn() {
  const router = useRouter();

  const logout = async () => {
    const res = await adminLogout();
    if (res.success) {
      toast.success(res.message);
      router.push("/admin-login");
    } else {
      toast.error(res.message);
    }
  };
  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-red-300 hover:bg-red-500/10 hover:text-red-400 transition mb-4 w-full"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}
