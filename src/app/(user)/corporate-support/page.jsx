"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Clock, CheckCircle, Headphones } from "lucide-react";

export default function CorporateSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    subject: "",
    category: "other",
    message: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    const res = await fetch("/api/support").then((r) => r.json());
    if (res.success) setTickets(res.tickets);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!form.subject || !form.message)
      return alert("Subject & Message required");
    setSending(true);
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSending(false);
    if (json.success) {
      alert("Support ko bhej diya gaya");
      setForm({ subject: "", category: "other", message: "" });
      fetchTickets();
    } else {
      alert(json.error);
    }
  }

  return (
    <div className="w-full p-4 lg:p-6 space-y-6 bg-[#f5f7fb] min-h-screen">
      <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Headphones /> Corporate Support
        </h2>
        <p className="text-[11px] text-white/60 uppercase tracking-widest mt-1">
          Direct Contact With Company • 24/7 Support
        </p>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-4 text-black">
            <MessageCircle size={18} className="text-[#1E3A8A]" />
            <p className="text-[10px] text-gray-400 font-bold mt-1">
              TOTAL TICKETS
            </p>
            <h3 className="text-xl font-bold">{tickets.length}</h3>
          </div>
          <div className="bg-white rounded-2xl p-4 text-black">
            <Clock size={18} className="text-orange-500" />
            <p className="text-[10px] text-gray-400 font-bold mt-1">OPEN</p>
            <h3 className="text-xl font-bold">
              {tickets.filter((t) => t.status === "open").length}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-4 text-black">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-[10px] text-gray-400 font-bold mt-1">REPLIED</p>
            <h3 className="text-xl font-bold">
              {tickets.filter((t) => t.status === "replied").length}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-bold text-lg">Contact Support</h3>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-bold mb-2">Category</p>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-gray-100 border rounded-xl px-4 py-3 text-sm"
                >
                  <option value="deposit">Deposit Issue</option>
                  <option value="withdraw">Withdraw Issue</option>
                  <option value="account">Account Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <p className="text-sm font-bold mb-2">Subject</p>
                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="Ex: Deposit not approved"
                  className="w-full bg-gray-100 border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold mb-2">Your Message</p>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                placeholder="Explain your issue in detail..."
                className="w-full bg-gray-100 border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
              ></textarea>
            </div>
            <button
              onClick={handleSubmit}
              disabled={sending}
              className="w-full bg-[#1E3A8A] text-white font-bold py-3 rounded-xl hover:bg-[#162c6b] disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send to Corporate Support"}
            </button>
            <p className="text-[11px] text-gray-500 text-center">
              Our team replies within 2-6 hours • WhatsApp: 0300-XXXXXXX
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-bold">My Tickets</h3>
          <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto">
            {loading ? (
              <p className="text-xs text-gray-400 text-center py-10">
                Loading...
              </p>
            ) : tickets.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-10">
                No tickets yet
              </p>
            ) : (
              tickets.map((t) => (
                <div key={t._id} className="border rounded-xl p-3">
                  <div className="flex justify-between">
                    <p className="font-bold text-[12px]">{t.subject}</p>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold ${t.status === "open" ? "bg-yellow-100 text-yellow-700" : t.status === "replied" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {t.category} • {new Date(t.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-[11px] mt-2 bg-gray-50 p-2 rounded-lg">
                    {t.message}
                  </p>
                  {t.reply && (
                    <div className="mt-2 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 p-2 rounded-lg">
                      <p className="text-[10px] font-bold text-[#1E3A8A]">
                        Admin Reply:
                      </p>
                      <p className="text-[11px]">{t.reply}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
