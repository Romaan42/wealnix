// app/admin/layout.jsx - REAL COUNTS
import Link from "next/link";
import Deposit from "@/models/Deposit";
import Withdraw from "@/models/Withdraw";
import SupportTicket from "@/models/SupportTicket";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Ticket,
  BookOpen,
  BarChart3,
} from "lucide-react";
import connectDb from "@/lib/db";
import "../../globals.css";

export const dynamic = "force-dynamic";

async function getRealCounts() {
  try {
    await connectDb();
    const [pendingDeposits, pendingWithdraws, openTickets] = await Promise.all([
      Deposit.countDocuments({ status: "pending" }),
      Withdraw.countDocuments({ status: "pending" }),
      SupportTicket.countDocuments({ status: "open" }),
    ]);
    return { pendingDeposits, pendingWithdraws, openTickets };
  } catch (e) {
    console.error("Admin Layout Count Error:", e);
    return { pendingDeposits: 0, pendingWithdraws: 0, openTickets: 0 };
  }
}

export const metadata = {
  title: "WEALNEX - Admin Control Center",
};

export default async function AdminLayout({ children }) {
  const counts = await getRealCounts();

  const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, count: null },
    {
      name: "Deposits",
      href: "/admin/deposits",
      icon: ArrowDownToLine,
      count: counts.pendingDeposits,
      color: "bg-orange-500",
    },
    {
      name: "Withdrawals",
      href: "/admin/withdrawals",
      icon: ArrowUpFromLine,
      count: counts.pendingWithdraws,
      color: "bg-red-500",
    },
    { name: "Users", href: "/admin/users", icon: Users, count: null },
    {
      name: "Commissions",
      href: "/admin/commissions",
      icon: Wallet,
      count: null,
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      count: null,
    },
    {
      name: "Support Tickets",
      href: "/admin/support",
      icon: Ticket,
      count: counts.openTickets,
      color: "bg-blue-500",
    },
    {
      name: "LMS / Assets",
      href: "/admin/courses",
      icon: BookOpen,
      count: null,
    },
  ];

  return (
    <html>
      <body>
        <div className="flex min-h-screen bg-[#f8f9fb]">
          {/* Sidebar */}
          <aside className="w-[260px] bg-[#0f1115] text-white fixed h-full flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              <div className="mb-8">
                <h1 className="text-2xl font-black tracking-wider">WEALNEX</h1>
                <p className="text-[11px] text-gray-400 tracking-[0.2em] uppercase">
                  Admin Control Center
                </p>
                <div className="mt-2 text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded inline-block">
                  1 WX$ = PKR 100 (Peg)
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <p className="text-gray-400">Pending Dep</p>
                    <p className="text-sm font-bold text-orange-400">
                      {counts.pendingDeposits}
                    </p>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <p className="text-gray-400">Pending W/D</p>
                    <p className="text-sm font-bold text-red-400">
                      {counts.pendingWithdraws}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {menu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-gray-300 hover:bg-white/10 hover:text-white transition"
                  >
                    <item.icon size={18} />
                    {item.name}
                    {item.count !== null && item.count > 0 && (
                      <span
                        className={`ml-auto text-white text-[11px] px-2 py-0.5 rounded-full font-bold ${item.color || "bg-red-500"}`}
                      >
                        {item.count}
                      </span>
                    )}
                    {item.count === 0 && (
                      <span className="ml-auto text-[10px] text-gray-500">
                        0
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-gray-400">admin@wealnex.com</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-3">
                System: Live | Oct 2026 | Real DB
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <div className="ml-[260px] flex-1">
            {/* Top Header */}
            <header className="h-[64px] bg-white border-b sticky top-0 z-10 flex items-center justify-between px-8">
              <h2 className="font-semibold text-sm">
                Version 2.4 (Production Blueprint) - Real DB Mode
              </h2>
              <div className="flex gap-3 items-center text-sm">
                <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200 text-xs">
                  Dep: {counts.pendingDeposits} Pending
                </span>
                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-200 text-xs">
                  W/D: {counts.pendingWithdraws} Pending
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs">
                  ● System Live
                </span>
              </div>
            </header>

            <main className="p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
