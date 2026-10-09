"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Users,
  UserCheck,
  UserX,
  Search,
  QrCode,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import PagesLoader from "@/components/PagesLoader";

export default function ReferralsPage() {
  const [data, setData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async (pageNum, q) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/referrals/list?page=${pageNum}&search=${q}`,
        { cache: "no-store" },
      );
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message);
      } else {
        setData(json.user);
        setReferrals(json.referrals);
        setPagination(json.pagination);
      }
    } catch (e) {
      toast.error("Failed to load");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(pagination.page, search);
  }, [pagination.page]);

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData(1, search);
      setPagination((p) => ({ ...p, page: 1 }));
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  function copyLink() {
    if (!data?.stats?.referralLink) return;
    navigator.clipboard.writeText(data.stats.referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading && !data) return <PagesLoader />;

  return (
    <div className="w-full p-4 lg:p-6 space-y-6 bg-[#f5f7fb] min-h-screen">
      <Toaster />
      {/* Referral Link Card */}
      <div className="bg-gradient-to-br from-[#1E3A8A] to-[#2d4ab5] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold">Your Referral Link</h2>
            <p className="text-[11px] text-white/60 mt-1 uppercase tracking-widest">
              Share & Earn 10% Direct Commission
            </p>
          </div>
          <div className="bg-white/10 p-2 rounded-xl">
            <QrCode size={20} className="text-[#C5A059]" />
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <div className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono truncate">
            {data?.stats?.referralLink}
          </div>
          <button
            onClick={copyLink}
            className="bg-[#C5A059] hover:bg-[#b08d4e] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <Users className="text-[#1E3A8A]" size={20} />
          <p className="text-[11px] text-gray-400 font-bold uppercase mt-3">
            Total Referrals
          </p>
          <h3 className="text-2xl font-bold">{data?.stats?.directTeam || 0}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <UserCheck className="text-green-600" size={20} />
          <p className="text-[11px] text-gray-400 font-bold uppercase mt-3">
            Active
          </p>
          <h3 className="text-2xl font-bold text-green-600">
            {data?.stats?.active || 0}
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <UserX className="text-gray-400" size={20} />
          <p className="text-[11px] text-gray-400 font-bold uppercase mt-3">
            Inactive
          </p>
          <h3 className="text-2xl font-bold">{data?.stats?.inactive || 0}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-[#1E293B]">
            Direct Referrals - Level 1 (10%)
          </h3>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, username..."
              className="pl-9 pr-3 py-2 bg-gray-100 rounded-xl text-sm w-56 outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3">Bundle</th>
                <th className="p-3">Investment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-bold text-[#1E293B]">{r.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {r.userName} • {r.email}
                    </p>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 bg-[#C5A059]/10 text-[#8B6B2E] rounded-full text-[11px] font-bold">
                      {r.bundle} WX$
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold">${r.investment}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-bold ${r.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-center text-gray-500 text-xs">
                    {new Date(r.joined).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {referrals.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    No referrals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="px-3 py-1.5 bg-[#1E3A8A] text-white rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
