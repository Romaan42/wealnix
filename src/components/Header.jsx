"use client";
import { logoutUser } from "@/actions/userActions";
import { checkLogin } from "@/store/slices/userSlice";
import {
  LayoutDashboard,
  Network,
  Users,
  Landmark,
  Banknote,
  Headset,
  Settings,
  GraduationCap,
  X,
  Menu,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Network Summary", href: "/network-summary", icon: Network },
  { label: "My Referrals", href: "/referrals", icon: Users },
  { label: "Deposit Gateway", href: "/deposit", icon: Landmark },
  { label: "Withdraw Funds", href: "/withdraw-funds", icon: Banknote },
  { label: "Corporate Support", href: "/corporate-support", icon: Headset },
  { label: "Profile Settings", href: "/profile-settings", icon: Settings },
];

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(checkLogin());
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to sign out?")) return;

    const result = await logoutUser();
    if (!result.success) {
      toast.error(result.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster />
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-3 right-3 z-[60] p-2.5 rounded-xl bg-[#1E3A8A] text-white shadow-lg border border-white/20"
      >
        <Menu size={20} />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        min-h-screen fixed lg:static inset-y-0 left-0 z-50
        w-[270px] bg-[#1E3A8A] text-white flex flex-col justify-between
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div>
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C5A059] rounded flex items-center justify-center font-bold text-[#1E3A8A]">
                W
              </div>
              <h1 className="text-xl font-bold tracking-wide">Wealnex</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-white/10 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="px-3 space-y-1 text-[13px]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive ? "bg-[#C5A059] text-white font-semibold" : "text-white/80 hover:bg-white/10"}
              `}
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 space-y-3">
          <Link
            href="/lms"
            className="w-full bg-[#D4A017] hover:bg-[#C5A059] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <GraduationCap size={20} /> LMS Access Portal
          </Link>

          {/* SIGN OUT BUTTON */}
          <button
            onClick={handleLogout}
            className="w-full bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white/80 border border-white/10 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-[13px]"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </div>
  );
}
