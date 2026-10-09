// app/admin/deposits/page.jsx
"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminNote, setAdminNote] = useState({});

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/deposits?status=${filter}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setDeposits(data.deposits);
      } else {
        toast.error(data.error || "Failed to load");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [filter]);

  const handleAction = async (id, action) => {
    const note = adminNote[id] || "";
    if (action === "rejected" && !note) {
      toast.error("Rejection ke liye Admin Note likhna zaruri hai");
      return;
    }

    setActionLoading(id);
    const toastId = toast.loading(`${action}...`);

    try {
      const res = await fetch(`/api/admin/deposits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNote: note }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message, { id: toastId });
        // Remove from list if pending filter
        if (filter === "pending") {
          setDeposits((prev) => prev.filter((d) => d._id !== id));
        } else {
          fetchDeposits();
        }
      } else {
        toast.error(data.error, { id: toastId });
      }
    } catch (err) {
      toast.error("Request failed", { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header + Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Deposit Verification</h1>
          <p className="text-sm text-gray-500">
            PKR / 100 = WX$ | Manual receipt verification
          </p>
        </div>
        <div className="flex gap-2 bg-white border rounded-full p-1">
          {["pending", "approved", "rejected", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
                filter === s
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm">Loading deposits...</div>
        ) : deposits.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No {filter} deposits found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-[11px] uppercase text-gray-500 tracking-widest">
                <tr>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4">PKR / WX$</th>
                  <th className="py-3 px-4">Method / TrxID</th>
                  <th className="py-3 px-4">Screenshot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr
                    key={d._id}
                    className="border-b last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold">
                        {d.user?.userName || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{d.user?.email}</p>
                      <p className="text-xs text-gray-500">{d.user?.number}</p>
                      <p className="text-[11px] mt-1">
                        eWallet: WX$ {d.user?.wallet?.eWallet || 0}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold">PKR {d.amountPKR}</p>
                      <p className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded inline-block mt-1">
                        WX$ {d.amountWX}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(d.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="capitalize font-medium">{d.method}</p>
                      <p className="text-xs text-gray-500 break-all">
                        {d.trxId || "No TrxID"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      {d.screenshot ? (
                        <button
                          onClick={() => setSelectedImage(d.screenshot)}
                          className="w-12 h-12 rounded-lg overflow-hidden border hover:scale-105 transition"
                        >
                          <img
                            src={d.screenshot}
                            alt="proof"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${
                          d.status === "pending"
                            ? "bg-orange-100 text-orange-700"
                            : d.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {d.status === "pending" ? (
                        <div className="flex flex-col gap-2 items-end">
                          <input
                            type="text"
                            placeholder="Admin Note (optional for approve)"
                            className="w-48 text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                            value={adminNote[d._id] || ""}
                            onChange={(e) =>
                              setAdminNote({
                                ...adminNote,
                                [d._id]: e.target.value,
                              })
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              disabled={actionLoading === d._id}
                              onClick={() => handleAction(d._id, "approved")}
                              className="bg-black text-white px-3 py-1.5 rounded-lg text-xs disabled:opacity-50"
                            >
                              {actionLoading === d._id
                                ? "..."
                                : "Approve + Credit"}
                            </button>
                            <button
                              disabled={actionLoading === d._id}
                              onClick={() => handleAction(d._id, "rejected")}
                              className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 text-right">
                          {d.adminNote || "-"}
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

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white p-2 rounded-2xl max-w-lg w-full">
            <img
              src={selectedImage}
              alt="proof large"
              className="w-full rounded-xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-3 w-full bg-black text-white py-2 rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
