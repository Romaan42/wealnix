"use client";
import { useEffect, useState } from "react";
import { Search, Users, Crown, TrendingUp, Wallet } from "lucide-react";
import Loading from "../loading";

const TABS = ["All", "Direct", "Team Commission", "Binary", "ROI", "Withdraw"];

export default function TransactionRecords() {
  const [filter, setFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalEarned, setTotalEarned] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/transactions?type=${filter}&search=${search}`,
      ).then((r) => r.json());
      if (res.success) {
        setTransactions(res.transactions);
        setTotalEarned(res.totalEarned);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  // Search pe debounce - Enter press pe search
  const onSearchKey = (e) => {
    if (e.key === "Enter") fetchData();
  };

  const totalFiltered = transactions
    .filter((t) => t.amount > 0)
    .reduce((a, b) => a + b.amount, 0);

  if (loading) return <Loading />;

  return (
    <main className="flex-1 p-4 lg:p-8 bg-[#f8f9fb] min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[22px] font-bold text-[#0f172a]">
            Transaction Records
          </h2>
          <p className="text-[12px] text-gray-400">
            Real DB se - kahan se aur kitna mila
          </p>
        </div>
        <div className="bg-white border rounded-2xl px-5 py-3 flex items-center gap-6 shadow-sm">
          <div>
            <p className="text-[11px] text-gray-400">Total Earned (All Time)</p>
            <p className="text-[18px] font-bold text-[#0f172a]">
              WX${totalEarned.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[18px] border p-3 mb-5 flex flex-col lg:flex-row justify-between gap-3 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition ${filter === tab ? "bg-[#0f172a] text-white shadow" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSearchKey}
            placeholder="Search by name..."
            className="pl-9 pr-4 py-2 bg-gray-50 border rounded-xl text-[12px] w-full lg:w-[260px] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-[22px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8f9fb] border-b text-[11px] text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">From User</th>
                <th className="px-6 py-4 font-bold">Details</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {transactions.length ? (
                transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border
                      ${tx.type === "Direct" ? "bg-blue-50 text-blue-600 border-blue-100" : ""}
                      ${tx.type === "Team" ? "bg-purple-50 text-purple-600 border-purple-100" : ""}
                      ${tx.type === "Binary" ? "bg-amber-50 text-amber-600 border-amber-100" : ""}
                    `}
                      >
                        {tx.type === "Direct" ? (
                          <Users size={12} />
                        ) : (
                          <Crown size={12} />
                        )}
                        {tx.type} {tx.level ? ` L${tx.level}` : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          {tx.fromUser?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-[#0f172a]">
                            {tx.fromUser}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {tx.fromId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {tx.description}
                    </td>
                    <td
                      className={`px-6 py-4 font-black ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      +WX${tx.amount}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{tx.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    No records for {filter} - pehle koi deposit approve karo
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
