"use client";
import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Layers,
  Wallet,
  Crown,
  ArrowRight,
  Search,
} from "lucide-react";
import PagesLoader from "@/components/PagesLoader";

export default function NetworkSummaryPage() {
  const [data, setData] = useState(null);
  const [activeLevel, setActiveLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchNetwork() {
      setLoading(true);
      const res = await fetch("/api/network/summary", { cache: "no-store" });
      const json = await res.json();

      setData(json);
      setLoading(false);
    }
    fetchNetwork();
  }, []);

  if (loading) return <PagesLoader />;
  if (!data) return <div className="p-10">No data found</div>;

  const activeData = data.levels[activeLevel - 1];
  const filteredMembers = activeData.members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.userName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-4 w-full lg:p-6 space-y-6 bg-[#f5f7fb] min-h-screen">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase">
            Total Team
          </p>
          <h3 className="text-2xl font-bold">{data.totalTeam}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase">
            Direct
          </p>
          <h3 className="text-2xl font-bold">{data.direct}</h3>
        </div>
        <div className="bg-[#1E3A8A] rounded-2xl p-5 text-white">
          <p className="text-[11px] text-white/60 uppercase">E-Wallet (80%)</p>
          <h3 className="text-2xl font-bold">WX$ {data.eWallet}</h3>
        </div>
        <div className="bg-[#C5A059] rounded-2xl p-5 text-white">
          <p className="text-[11px] text-white/80 uppercase">
            Total Commission
          </p>
          <h3 className="text-2xl font-bold">WX$ {data.totalCommission}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="font-bold flex gap-2">
            <Layers size={18} className="text-[#1E3A8A]" /> 5 Level Network
          </h2>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2 top-2.5 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user..."
              className="pl-7 pr-3 py-1.5 bg-gray-100 rounded-lg text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2 p-4 overflow-x-auto">
          {data.levels.map((lvl) => (
            <button
              key={lvl.level}
              onClick={() => setActiveLevel(lvl.level)}
              className={`px-4 py-2 rounded-xl text-sm font-bold ${activeLevel === lvl.level ? "bg-[#1E3A8A] text-white" : "bg-gray-100"}`}
            >
              L{lvl.level} ({lvl.count}) {lvl.percent}%
            </button>
          ))}
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="bg-[#f5f7fb] p-3 rounded-xl">
            <p className="text-[10px] text-gray-400 uppercase">Earned</p>
            <p className="font-bold text-green-600">
              WX$ {activeData.commission}
            </p>
          </div>
          <div className="bg-[#f5f7fb] p-3 rounded-xl">
            <p className="text-[10px] text-gray-400 uppercase">Members</p>
            <p className="font-bold">{activeData.count}</p>
          </div>
          <div className="bg-[#f5f7fb] p-3 rounded-xl">
            <p className="text-[10px] text-gray-400 uppercase">Percent</p>
            <p className="font-bold text-[#C5A059]">{activeData.percent}%</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[11px] text-gray-400 uppercase">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3">Bundle</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3 font-bold">
                    {m.name}
                    <p className="text-[11px] text-gray-400 font-normal">
                      {m.userName}
                    </p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-[#C5A059]/10 text-[#8B6B2E] px-2 py-1 rounded-full text-xs">
                      {m.bundle}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">
                    {new Date(m.joined).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
