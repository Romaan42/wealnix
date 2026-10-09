// app/admin/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-sm">Loading real data from 4 models...</div>
    );
  if (!data || data.error)
    return <div className="p-10 text-red-500">Error: {data?.error}</div>;

  return (
    <div className="space-y-6">
      {/* Row 1: Wallets - Real from User.wallet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border">
          <p className="text-[11px] text-gray-500 uppercase">
            Total E-Wallet (80% - Real)
          </p>
          <h3 className="text-2xl font-bold mt-2">
            WX$ {data.wallets.totalEWallet.toFixed(2)}
          </h3>
          <p className="text-xs text-gray-500">
            PKR {(data.wallets.totalEWallet * 100).toLocaleString()} | Sum of
            User.wallet.eWallet
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border">
          <p className="text-[11px] text-gray-500 uppercase">
            Total S-Wallet (20% - Real)
          </p>
          <h3 className="text-2xl font-bold mt-2">
            WX$ {data.wallets.totalSWallet.toFixed(2)}
          </h3>
          <p className="text-xs text-gray-500">
            Locked till WX$ 500 | Sum of User.wallet.sWallet
          </p>
        </div>
        <div className="bg-black text-white p-5 rounded-2xl">
          <p className="text-[11px] text-gray-400 uppercase">
            Total Withdrawn (Lifetime)
          </p>
          <h3 className="text-2xl font-bold mt-2">
            WX$ {data.wallets.totalWithdrawn.toFixed(2)}
          </h3>
          <p className="text-xs text-gray-400">
            Sum of User.wallet.totalWithdrawn
          </p>
        </div>
      </div>

      {/* Row 2: Users */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border">
          <p className="text-xs text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold mt-1">{data.users.total}</h2>
          <p className="text-xs mt-2">
            <span className="text-green-600">{data.users.active} Active</span> |{" "}
            <span className="text-red-500">
              {data.users.suspended} Suspended
            </span>{" "}
            | {data.users.unverified} Unverified
          </p>
        </div>
        <Link
          href="/admin/deposits"
          className="bg-white p-5 rounded-2xl border hover:shadow-md"
        >
          <p className="text-xs text-gray-500">Deposits</p>
          <h2 className="text-2xl font-bold mt-1 text-orange-600">
            {data.deposits.pending} Pending
          </h2>
          <p className="text-xs mt-1">
            {data.deposits.approved} Approved | {data.deposits.rejected}{" "}
            Rejected
          </p>
          <p className="text-[11px] text-gray-400 mt-2">
            Approved: WX$ {data.deposits.totalApprovedWX} (PKR{" "}
            {data.deposits.totalApprovedPKR})
          </p>
        </Link>
        <Link
          href="/admin/withdrawals"
          className="bg-white p-5 rounded-2xl border hover:shadow-md"
        >
          <p className="text-xs text-gray-500">Withdrawals</p>
          <h2 className="text-2xl font-bold mt-1 text-red-600">
            {data.withdraws.pending} Pending
          </h2>
          <p className="text-xs mt-1">
            {data.withdraws.approved} Approved | {data.withdraws.rejected}{" "}
            Rejected
          </p>
          <p className="text-[11px] text-gray-400 mt-2">
            Tax Collected: WX$ {data.withdraws.totalTaxWX.toFixed(2)}
          </p>
        </Link>
        <Link
          href="/admin/support"
          className="bg-white p-5 rounded-2xl border hover:shadow-md"
        >
          <p className="text-xs text-gray-500">Support Tickets</p>
          <h2 className="text-2xl font-bold mt-1">{data.support.open} Open</h2>
          <p className="text-xs text-gray-400 mt-1">From SupportTicket Model</p>
        </Link>
      </div>

      {/* Row 3: Deposit / Withdraw Summary Table */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-bold text-sm mb-4">
          Financial Summary (Only from Deposit & Withdraw Models)
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Total Deposited (Approved)</p>
            <p className="font-bold text-lg">
              WX$ {data.deposits.totalApprovedWX} = PKR{" "}
              {data.deposits.totalApprovedPKR}
            </p>
            <p className="text-[11px] text-gray-400">
              Formula: amountPKR / 100 = amountWX
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500">Total Paid (Approved Withdraws)</p>
            <p className="font-bold text-lg">
              Net WX$ {data.withdraws.totalNetWX.toFixed(2)} | Requested WX${" "}
              {data.withdraws.totalRequestedWX.toFixed(2)}
            </p>
            <p className="text-[11px] text-gray-400">
              Formula: Tax = amountWX * 0.10, Net = amount - tax, PKR = Net *
              100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
