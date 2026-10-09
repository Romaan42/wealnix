// app/admin/support/page.jsx
"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("open");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/support?status=${status}&category=${category}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
      else toast.error(data.error);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, category]);

  const handleAction = async (id, action) => {
    if (action === "reply" && replyText.trim().length < 5) {
      toast.error("Reply me kam se kam 5 characters likho");
      return;
    }
    setActionLoading(true);
    const tId = toast.loading(`${action}...`);
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reply: replyText }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { id: tId });
        setSelected(null);
        setReplyText("");
        if (status !== "all") {
          setTickets((prev) => prev.filter((t) => t._id !== id));
        } else {
          fetchTickets();
        }
      } else {
        toast.error(data.error, { id: tId });
      }
    } catch {
      toast.error("Failed", { id: tId });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-sm text-gray-500">
            {tickets.length} tickets - User queries from app
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="bg-white border px-4 py-2 rounded-full text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 bg-white border rounded-full p-1">
          {["open", "replied", "closed", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize ${status === s ? "bg-black text-white" : "text-gray-500"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 bg-white border rounded-full p-1">
          {["all", "deposit", "withdraw", "account", "other"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs capitalize ${category === c ? "bg-gray-900 text-white" : "text-gray-500"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-sm">
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center text-sm text-gray-500">
            No {status} tickets in {category} category
          </div>
        ) : (
          tickets.map((t) => (
            <div
              key={t._id}
              className="bg-white border rounded-2xl p-5 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${t.status === "open" ? "bg-red-100 text-red-700" : t.status === "replied" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {t.status}
                    </span>
                    <span className="text-[10px] bg-black text-white px-2 py-1 rounded-full uppercase">
                      {t.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(t.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-semibold mt-2">{t.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                    {t.message}
                  </p>
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                    <p>
                      <span className="font-semibold">User:</span> @
                      {t.user?.userName} | {t.user?.email} | {t.user?.number}
                    </p>
                    <p>
                      Bundle: WX$ {t.user?.currentBundle} | Rank: {t.user?.rank}
                    </p>
                    {t.reply && (
                      <div className="mt-3 border-t pt-3">
                        <p className="font-semibold text-green-700">
                          Admin Reply:
                        </p>
                        <p className="text-gray-700 mt-1">{t.reply}</p>
                        <p className="text-[11px] text-gray-400 mt-1">
                          Replied at:{" "}
                          {t.repliedAt
                            ? new Date(t.repliedAt).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelected(t);
                    setReplyText(t.reply || "");
                  }}
                  className="bg-black text-white px-4 py-2 rounded-full text-xs shrink-0"
                >
                  {t.status === "open" ? "Reply" : "Manage"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Reply to Ticket</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-gray-500"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-sm">
              <p className="font-semibold">{selected.subject}</p>
              <p className="text-xs text-gray-500 mt-1">
                From: @{selected.user?.userName} | Category: {selected.category}
              </p>
              <p className="mt-2 text-gray-700">{selected.message}</p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500">
                Admin Reply
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                placeholder="Type your reply here... Be helpful and clear"
                className="w-full border rounded-xl p-3 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="flex gap-2">
              <button
                disabled={actionLoading}
                onClick={() => handleAction(selected._id, "reply")}
                className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm disabled:opacity-50"
              >
                {actionLoading ? "..." : "Send Reply & Mark Replied"}
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleAction(selected._id, "close")}
                className="bg-white border border-gray-300 px-4 py-2.5 rounded-xl text-sm"
              >
                Close Ticket
              </button>
              {selected.status === "closed" && (
                <button
                  disabled={actionLoading}
                  onClick={() => handleAction(selected._id, "reopen")}
                  className="bg-yellow-500 text-white px-4 py-2.5 rounded-xl text-sm"
                >
                  Reopen
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-400">
              Reply ke baad user ko notification jayega (future: add
              email/notification model)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
