"use client";
import { checkLogin } from "@/store/slices/userSlice";
import {
  LayoutDashboard,
  Network,
  Users,
  BarChart3,
  Landmark,
  Banknote,
  FileText,
  ShieldCheck,
  Headset,
  Settings,
  GraduationCap,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLogin());
  }, []);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Responsive */}
      <aside
        className={`
            fixed lg:static inset-y-0 left-0 z-50
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
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="px-3 space-y-1 text-[13px]">
            <a className="flex items-center gap-3 bg-[#C5A059] text-white px-4 py-3 rounded-lg font-semibold">
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <Network size={18} /> Network Summary
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <Users size={18} /> My Referrals
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <BarChart3 size={18} /> Financial Overview
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <Landmark size={18} /> Deposit Gateway
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <Banknote size={18} /> Withdraw Funds
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <FileText size={18} /> Transaction Logs
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <ShieldCheck size={18} /> Security & KYC
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <Headset size={18} /> Corporate Support
            </a>
            <a className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg text-white/80">
              <Settings size={18} /> Profile Settings
            </a>
          </nav>
        </div>

        <div className="p-4">
          <button className="w-full bg-[#D4A017] hover:bg-[#C5A059] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <GraduationCap size={20} /> LMS Access Portal
          </button>
        </div>
      </aside>
    </>
  );
}
