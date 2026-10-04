"use client";
import {
  BadgeCheck,
  Bell,
  Crown,
  Menu,
  Search,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./loading";
import { logoutUser } from "@/actions/userActions";
import { checkLogin } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, userLoading } = useSelector((state) => state.user);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      router.push("/login");
    }
  };

  if (userLoading || !user) return <Loading />;
  return (
    <main className="flex-1 p-4 lg:p-6 w-full overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 bg-white rounded-lg border"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-[20px] lg:text-[22px] font-bold text-[#1E293B]">
            Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-3 lg:gap-4 text-gray-500">
          <Search size={18} className="hidden sm:block" />
          <Bell size={18} />
          <Settings size={18} className="hidden sm:block" />
          <div
            onClick={handleLogout}
            className="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full"
          >
            {user?.name[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Cards Row - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="w-8 h-8 bg-[#1E3A8A] text-white rounded flex items-center justify-center">
              <Wallet size={16} />
            </div>
            E-Wallet
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            80% Withdrawable Balance
          </p>
          <h3 className="text-[22px] font-bold mt-1">
            WX${user?.wallet?.eWallet}
          </h3>
          <p className="text-[11px] text-gray-400">Balance</p>
          <button className="mt-3 bg-[#C5A059] text-white text-[11px] px-3 py-1.5 rounded-full">
            Withdraw funds
          </button>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="w-8 h-8 bg-[#1E3A8A] text-white rounded flex items-center justify-center">
              <Wallet size={16} />
            </div>
            S-Wallet
          </div>
          <p className="text-[11px] text-gray-500 mt-2">20% Reserve Balance</p>
          <h3 className="text-[22px] font-bold mt-1">
            WX${user?.wallet?.sWallet}
          </h3>
          <p className="text-[11px] text-gray-400">Balance</p>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Earnings</p>
          <h3 className="text-xl font-bold">$19,250.00</h3>
          <p className="text-[10px] text-gray-400">Sum</p>
          <div className="mt-3 flex items-center text-[#C5A059]">
            <TrendingUp size={40} />
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm text-center">
          <p className="text-xs">Active Membership Bundle</p>
          <span className="bg-[#C5A059]/20 text-[#8B6B2E] border border-[#C5A059] text-[11px] px-3 py-1 rounded-full mt-2 inline-flex items-center gap-1">
            <Crown size={12} /> GOLD TIER
          </span>
          <div className="text-[10px] mt-3 text-left">
            <div className="flex justify-between">
              <span>Plan</span>
              <span className="text-[#C5A059]">Gold TIER</span>
            </div>
            <div className="flex justify-between">
              <span>Plan Summary</span>
              <span>GOLD</span>
            </div>
            <div className="flex justify-between mt-2 border-t pt-2">
              <span>Total</span>
              <span>$18,250.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm text-center sm:col-span-2 lg:col-span-1 xl:col-span-1">
          <p className="text-xs">Corporate KYC Status</p>
          <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mt-3 flex items-center justify-center">
            <BadgeCheck className="text-green-600" size={28} />
          </div>
          <p className="text-xs font-bold text-green-600 mt-2">VERIFIED</p>
          <p className="text-[9px] text-gray-500 mt-1">
            Corporate KYC Verified with CNIC validation tag
          </p>
          <p className="text-[9px] mt-2">Verified 12/2024</p>
        </div>
      </div>

      {/* Bottom - Responsive */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border p-5">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm lg:text-base">
              Financial Overview
            </h4>
            <select className="text-xs border rounded px-2 py-1">
              <option>Max Months</option>
            </select>
          </div>
          <div className="flex gap-1 mt-6 h-[180px] items-end">
            {[70, 120, 60, 80, 130, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 justify-center">
                  <div
                    className="w-3 lg:w-4 bg-[#1E3A8A] rounded-t"
                    style={{ height: `${h}px` }}
                  ></div>
                  <div
                    className="w-3 lg:w-4 bg-[#C5A059] rounded-t"
                    style={{ height: `${h - 20}px` }}
                  ></div>
                </div>
                <span className="text-[10px] lg:text-[11px] text-gray-500">
                  {["Jun", "Feb", "Mar", "Apr", "May", "Jon"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <h4 className="font-bold mb-4 text-sm lg:text-base">
            Recent Activity
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="text-gray-400">
                <tr>
                  <td>Date</td>
                  <td>Description</td>
                  <td>Amount</td>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                <tr className="bg-[#1E3A8A] text-white">
                  <td className="py-2 px-2 rounded-l">Boom - Acp 12, 2024</td>
                  <td>Deoc Ription</td>
                  <td className="rounded-r">$15,450.00</td>
                </tr>
                <tr>
                  <td className="py-2">Boom - July 23, 2024</td>
                  <td>Withdraw Funds</td>
                  <td>$1,550.00</td>
                </tr>
                <tr>
                  <td className="py-2">Boom - July 23, 2024</td>
                  <td>Withdraw Funds</td>
                  <td>$250.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </main>
  );
}
