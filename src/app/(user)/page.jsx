"use client";
import {
  Wallet,
  TrendingUp,
  Crown,
  ShieldCheck,
  Menu,
  Package,
  Award,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";

// Blueprint Bundle Matrix
const BUNDLE_INFO = {
  0: { name: "No Bundle", price: 0, vp: 0, color: "bg-gray-100 text-gray-500" },
  20: {
    name: "Starter",
    price: 20,
    vp: 2,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  50: {
    name: "Silver",
    price: 50,
    vp: 5,
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  100: {
    name: "Gold",
    price: 100,
    vp: 10,
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  150: {
    name: "Platinum",
    price: 150,
    vp: 15,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  200: {
    name: "Diamond",
    price: 200,
    vp: 20,
    color: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
};

const RANKS = [
  { name: "Beginner", vp: 0 },
  { name: "Bronze", vp: 100 },
  { name: "Silver", vp: 300 },
  { name: "Gold", vp: 800 },
  { name: "Platinum", vp: 2500 },
  { name: "Diamond", vp: 8000 },
  { name: "Crown Director", vp: 20000 },
];

function getNextRank(currentVP) {
  for (let i = 0; i < RANKS.length; i++) {
    if (currentVP < RANKS[i].vp) return RANKS[i];
  }
  return null; // Max rank
}

export default function Dashboard({ setSidebarOpen }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const d1 = await fetch("/api/user/dashboard").then((r) => r.json());
        const d2 = await fetch("/api/referrals/top").then((r) => r.json());
        if (d1.success) setData(d1);
        if (d2.success) setPartners(d2.partners);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !data) return <Loading />;

  const {
    wallet,
    stats,
    membership,
    user,
    recentActivities,
    financialOverview,
  } = data;
  const isActive = data.kyc.status === "active";

  // FIX: Tier null handle + Plan details
  const currentBundle = BUNDLE_INFO[membership.currentBundle] || BUNDLE_INFO[0];
  const tierName = membership.tier || "Beginner"; // null ho to Beginner
  const nextRank = getNextRank(membership.volumePoints || 0);
  const progressToNext = nextRank
    ? Math.min(((membership.volumePoints || 0) / nextRank.vp) * 100, 100)
    : 100;

  return (
    <main className="flex-1 p-4 lg:p-8 bg-[#f8f9fb] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white px-6 py-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-[#0f172a]">Dashboard</h2>
            <p className="text-[12px] text-gray-400">
              Welcome back, {user?.name || "User"} 👋
            </p>
          </div>
        </div>
        <div className="w-9 h-9 bg-[#0f172a] text-white rounded-full flex items-center justify-center font-bold">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
        <div className="bg-[#0f172a] rounded-[22px] p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/20 rounded-full blur-[30px]"></div>
          <div>
            <p className="text-[11px] text-white/60">E-Wallet</p>
            <h3 className="text-[24px] font-bold mt-1">
              WX$ {(wallet.eWallet || 0).toLocaleString()}
            </h3>
            <p className="text-[10px] text-white/40">
              PKR {((wallet.eWallet || 0) * 100).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => router.push("/withdraw")}
            className="mt-4 w-full bg-[#C5A059] hover:bg-[#b8944f] text-white py-2.5 rounded-xl text-[11px] font-bold"
          >
            Withdraw funds
          </button>
        </div>

        <div className="bg-white rounded-[22px] border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-gray-500">S-Wallet</p>
            <h3 className="text-[24px] font-bold text-[#0f172a] mt-1">
              WX$ {(wallet.sWallet || 0).toLocaleString()}
            </h3>
            <p className="text-[10px] text-gray-400 mt-1">
              Locked till 500 WX$
            </p>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 pt-2 border-t">
            Total: WX$ {(wallet.total || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-[22px] border p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[12px] text-gray-500 font-semibold">
              Total Deposits
            </p>
            <h3 className="text-[22px] font-bold text-[#0f172a] mt-1">
              WX$ {(stats.totalDepositsWX || 0).toLocaleString()}
            </h3>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t">
            Team Sales: WX${(stats.totalTeamSalesWX || 0).toLocaleString()}
          </p>
        </div>

        {/* PLAN DETAILS CARD - NEW */}
        <div
          className={`rounded-[22px] border p-5 shadow-sm flex flex-col justify-between ${currentBundle.color} border`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Package size={14} />
              <p className="text-[11px] font-bold uppercase">Current Plan</p>
            </div>
            <h3 className="text-[18px] font-black mt-2">
              {currentBundle.name}
            </h3>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] bg-white/70 px-2 py-1 rounded-full font-bold">
                WX${currentBundle.price}
              </span>
              <span className="text-[10px] bg-white/70 px-2 py-1 rounded-full font-bold">
                {currentBundle.vp} VP
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-black/10">
            <div className="flex items-center gap-1.5">
              <Crown size={12} />
              <p className="text-[11px] font-bold">{tierName}</p>
            </div>
            <p className="text-[10px] mt-1 opacity-70">
              Total VP: {membership.volumePoints || 0}
            </p>
            {nextRank && (
              <div className="mt-2">
                <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f172a] h-full rounded-full transition-all"
                    style={{ width: `${progressToNext}%` }}
                  ></div>
                </div>
                <p className="text-[9px] mt-1 opacity-60">
                  Next: {nextRank.name} ({nextRank.vp} VP)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[22px] border p-5 shadow-sm text-center flex flex-col justify-between items-center">
          <div>
            <p className="text-[12px] text-gray-500 font-semibold">
              Account Status
            </p>
            <div
              className={`w-10 h-10 mx-auto mt-2 rounded-full flex items-center justify-center ${isActive ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-500"}`}
            >
              <ShieldCheck size={20} />
            </div>
          </div>
          <p
            className={`text-[13px] font-black uppercase ${isActive ? "text-green-600" : "text-orange-500"}`}
          >
            {data.kyc.status}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-[22px] border p-6 shadow-sm">
          <h4 className="font-bold text-[16px] text-[#0f172a] mb-6">
            Financial Overview
          </h4>
          <div className="h-48 flex items-end gap-3 border-b pb-2">
            {financialOverview.map((b, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
              >
                <div className="w-full flex gap-1 justify-center h-full items-end">
                  <div
                    style={{ height: `${Math.min(b.income / 2, 100)}%` }}
                    className="w-4 bg-[#0f172a] rounded-t"
                  ></div>
                  <div
                    style={{ height: `${Math.min(b.expense / 2, 100)}%` }}
                    className="w-4 bg-[#C5A059] rounded-t"
                  ></div>
                </div>
                <span className="text-[11px] text-gray-500">{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-[22px] border p-6 shadow-sm">
            <h4 className="font-bold text-[15px] text-[#0f172a] mb-4">
              Recent Activity
            </h4>
            <div className="space-y-3">
              {recentActivities.length ? (
                recentActivities.map((tx, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 text-[12px]"
                  >
                    <div>
                      <p className="font-semibold text-[#0f172a]">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {tx.date} • {tx.status}
                      </p>
                    </div>
                    <span
                      className={`font-bold px-2 py-1 rounded-md text-[11px] ${tx.status === "approved" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
                    >
                      {tx.status === "approved" ? "+" : " "}WX${tx.amount}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-6">
                  No deposits yet
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[22px] border p-5 shadow-sm">
            <h4 className="font-bold text-[14px] text-[#0f172a] mb-3">
              Top Team
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {partners.length ? (
                partners.map((p, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 p-2.5 rounded-xl text-center border"
                  >
                    <div className="w-8 h-8 bg-[#0f172a] text-white rounded-full mx-auto flex items-center justify-center text-xs font-bold">
                      {p.avatar}
                    </div>
                    <p className="text-[11px] font-bold text-[#0f172a] mt-1 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-[#C5A059] font-bold">
                      {p.earnings}
                    </p>
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-xs text-center text-gray-400 py-4">
                  No direct team yet
                </p>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center">
              Direct: {stats.directTeam} | Total: {stats.totalTeam}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
