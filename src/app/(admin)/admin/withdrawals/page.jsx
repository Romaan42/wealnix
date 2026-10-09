// app/admin/withdrawals/page.jsx
"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);
  const [inputs, setInputs] = useState({}); // { [id]: { trxId, note } }

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/withdrawals?status=${filter}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals);
      else toast.error(data.error);
    } catch {
      toast.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handleAction = async (id, action) => {
    const trxId = inputs[id]?.trxId || "";
    const note = inputs[id]?.note || "";

    if (action === "approved" && !trxId) {
      toast.error("Admin Transaction ID (JazzCash/EasyPaisa Txn ID) likho!");
      return;
    }
    if (action === "rejected" && !note) {
      toast.error("Reject reason likhna zaruri hai");
      return;
    }

    setActionLoading(id);
    const tId = toast.loading(`${action}...`);

    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminTrxId: trxId, adminNote: note }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { id: tId });
        if (filter === "pending") {
          setWithdrawals((prev) => prev.filter((w) => w._id !== id));
        } else {
          fetchData();
        }
      } else {
        toast.error(data.error, { id: tId });
      }
    } catch {
      toast.error("Request failed", { id: tId });
    } finally {
      setActionLoading(null);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied: " + text);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Withdrawal Queue</h1>
          <p className="text-sm text-gray-500">
            Formula: Tax = Req * 10% | Net = Req - Tax | PKR = Net * 100
          </p>
        </div>
        <div className="flex gap-2 bg-white border rounded-full p-1">
          {["pending", "approved", "rejected", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize ${filter === s ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm">Loading withdrawals...</div>
        ) : withdrawals.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No {filter} withdrawals
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-[11px] uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4">Amount (WX$ / PKR)</th>
                  <th className="py-3 px-4">Account Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr
                    key={w._id}
                    className="border-b last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold">{w.user?.userName}</p>
                      <p className="text-xs text-gray-500">{w.user?.email}</p>
                      <p className="text-xs text-gray-500">{w.user?.number}</p>
                      <p className="text-[11px] mt-1">
                        Bundle: {w.user?.currentBundle || 0} | Rank:{" "}
                        {w.user?.rank}
                      </p>
                      <p className="text-[11px]">
                        eWallet: WX$ {w.user?.wallet?.eWallet?.toFixed(2)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold">Req: WX$ {w.amountWX}</p>
                      <p className="text-xs text-red-500">
                        Tax (10%): -WX$ {w.taxWX}
                      </p>
                      <p className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">
                        Net: WX$ {w.netWX}
                      </p>
                      <p className="text-xs font-semibold mt-1">
                        PKR {w.amountPKR} (Disburse)
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(w.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="capitalize font-medium">{w.method}</p>
                      <p className="text-xs">Title: {w.accountTitle}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs break-all">
                          No: {w.accountNumber}
                        </p>
                        <button
                          onClick={() => copyText(w.accountNumber)}
                          className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${w.status === "pending" ? "bg-orange-100 text-orange-700" : w.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {w.status}
                      </span>
                      {w.adminTrxId && (
                        <p className="text-[11px] mt-1">Txn: {w.adminTrxId}</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {w.status === "pending" ? (
                        <div className="flex flex-col gap-2 items-end w-56 ml-auto">
                          <input
                            type="text"
                            placeholder="Admin Txn ID (JazzCash/EasyPaisa) - Required for Approve"
                            className="w-full text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                            value={inputs[w._id]?.trxId || ""}
                            onChange={(e) =>
                              setInputs({
                                ...inputs,
                                [w._id]: {
                                  ...inputs[w._id],
                                  trxId: e.target.value,
                                },
                              })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Admin Note / Reject Reason"
                            className="w-full text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                            value={inputs[w._id]?.note || ""}
                            onChange={(e) =>
                              setInputs({
                                ...inputs,
                                [w._id]: {
                                  ...inputs[w._id],
                                  note: e.target.value,
                                },
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              disabled={actionLoading === w._id}
                              onClick={() => handleAction(w._id, "approved")}
                              className="bg-black text-white px-3 py-1.5 rounded-lg text-xs disabled:opacity-50"
                            >
                              {actionLoading === w._id
                                ? "..."
                                : "Approve & Pay"}
                            </button>
                            <button
                              disabled={actionLoading === w._id}
                              onClick={() => handleAction(w._id, "rejected")}
                              className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs"
                            >
                              Refund
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          {w.adminNote || "-"}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
