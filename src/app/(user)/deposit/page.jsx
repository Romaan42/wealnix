"use client";
import { useState, useEffect } from "react";
import { DollarSign, Clock, CheckCircle } from "lucide-react";
import { WX_RATE } from "@/config/wealnex.config";
import PagesLoader from "@/components/PagesLoader";

export default function DepositGatewayPage() {
  const [data, setData] = useState({
    wallet: { eWallet: 0, sWallet: 0 },
    history: [],
    stats: { total: 0, pending: 0, success: 0 },
  });
  const [amountPKR, setAmountPKR] = useState(2000);
  const [method, setMethod] = useState("jazzcash");
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // REAL API FETCH
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [walletRes, historyRes] = await Promise.all([
          fetch("/api/wallet/balance", { cache: "no-store" }),
          fetch("/api/deposit/history", { cache: "no-store" }),
        ]);
        const walletJson = await walletRes.json();
        const historyJson = await historyRes.json();

        setData({
          wallet: walletJson.wallet || { eWallet: 0, sWallet: 0 },
          history: historyJson.history || [],
          stats: historyJson.stats || { total: 0, pending: 0, success: 0 },
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const wxAmount = Math.floor(amountPKR / WX_RATE); // REAL FORMULA: 100 PKR = 1 WX$

  const handleSubmit = async () => {
    if (amountPKR < 500) return alert("Minimum 500 PKR");
    if (!trxId.trim()) return alert("Please enter Transaction ID");

    setSubmitting(true);
    try {
      const res = await fetch("/api/deposit/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPKR, method, trxId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      alert(`Success! ${json.youWillGet} will be added after admin approval.`);
      setTrxId("");
      // Refresh history
      const historyRes = await fetch("/api/deposit/history");
      const historyJson = await historyRes.json();
      setData((d) => ({
        ...d,
        history: historyJson.history,
        stats: historyJson.stats,
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PagesLoader />;

  const methods = [
    {
      id: "jazzcash",
      name: "JazzCash",
      desc: "Pay via JazzCash mobile wallet • Instant",
      acc: "0300-1234567 (Wealnex)",
    },
    {
      id: "easypaisa",
      name: "EasyPaisa",
      desc: "Pay via EasyPaisa mobile wallet • Instant",
      acc: "0345-1234567 (Wealnex)",
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      desc: "Crypto deposit via USDT • Min 10 USDT",
      acc: "TXyz...Abc123 (TRC20)",
    },
  ];

  return (
    <div className="p-4 w-full lg:p-6 space-y-6 bg-[#f5f7fb] min-h-screen">
      {/* Top Blue Card */}
      <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">Deposit Gateway</h2>
        <p className="text-[11px] text-white/60 uppercase tracking-widest mt-1">
          eWallet: {data.wallet.eWallet} WX$ • sWallet: {data.wallet.sWallet}{" "}
          WX$ • Rate 1 WX$ = {WX_RATE} PKR
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-5 text-black">
            <DollarSign size={18} className="text-[#1E3A8A]" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              TOTAL DEPOSITED
            </p>
            <h3 className="text-2xl font-bold">{data.stats.total} PKR</h3>
            <p className="text-[11px] text-green-600 mt-1">
              ≈ {Math.floor(data.stats.total / WX_RATE)} WX$
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-black">
            <Clock size={18} className="text-[#C5A059]" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              PENDING
            </p>
            <h3 className="text-2xl font-bold">{data.stats.pending} PKR</h3>
            <p className="text-[11px] text-gray-500 mt-1">
              {data.history.filter((h) => h.status === "pending").length}{" "}
              processing
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 text-black">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              SUCCESSFUL
            </p>
            <h3 className="text-2xl font-bold">{data.stats.success} PKR</h3>
            <p className="text-[11px] text-gray-500 mt-1">
              {data.history.filter((h) => h.status === "approved").length}{" "}
              completed
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-bold text-lg">Deposit Funds</h2>
            <p className="text-sm font-semibold mt-3">Select Payment Method</p>
          </div>

          <div className="p-5 space-y-3">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full text-left p-4 rounded-xl border-2 flex justify-between items-center transition ${method === m.id ? "border-[#1E3A8A] bg-[#1E3A8A]/5" : "border-gray-200 bg-white"}`}
              >
                <div>
                  <p className="font-bold text-sm">
                    {m.name} •{" "}
                    <span className="font-mono text-[11px]">{m.acc}</span>
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">{m.desc}</p>
                </div>
                {method === m.id && (
                  <div className="w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </button>
            ))}

            <div className="pt-4 space-y-3">
              <div>
                <p className="font-bold text-sm mb-2">
                  Enter Deposit Amount (PKR)
                </p>
                <div className="relative">
                  <input
                    type="number"
                    value={amountPKR}
                    onChange={(e) => setAmountPKR(Number(e.target.value))}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 pr-16 outline-none focus:border-[#1E3A8A] font-bold"
                  />
                  <span className="absolute right-4 top-3.5 text-sm text-gray-500">
                    PKR
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  {[2000, 5000, 10000, 20000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmountPKR(v)}
                      className="text-xs bg-gray-100 px-3 py-1.5 rounded-full hover:bg-[#1E3A8A] hover:text-white"
                    >
                      {v / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-bold text-sm mb-2">Transaction ID (TrxID)</p>
                <input
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="JC1234567890 ya Txn Hash"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#1E3A8A] text-sm"
                />
              </div>

              {/* REAL CONVERSION - FIXED */}
              <div className="bg-[#C5A059]/15 border border-[#C5A059]/30 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">You will receive</p>
                  <p className="text-xl font-bold text-[#8B6B2E]">
                    {wxAmount} WX$
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {amountPKR} PKR / {WX_RATE}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Conversion Rate:</p>
                  <p className="text-xs font-bold">1 WX$ = {WX_RATE} PKR</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-2 bg-[#C5A059] text-white font-bold py-3.5 rounded-xl hover:bg-[#A88645] transition disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : `Submit Deposit for ${wxAmount} WX$`}
              </button>
            </div>
          </div>
        </div>

        {/* Right - History */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-bold text-lg">Recent Deposits</h3>
            <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
              {data.history.length === 0 && (
                <p className="text-xs text-gray-500 text-center py-6">
                  No deposits yet
                </p>
              )}
              {data.history.slice(0, 10).map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[12px] border-b border-gray-100 pb-2 last:border-0"
                >
                  <div>
                    <p className="font-bold">
                      {h.amountWX} WX${" "}
                      <span className="font-normal text-gray-500">
                        ({h.amountPKR} PKR)
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(h.createdAt).toLocaleDateString()} • {h.method}
                    </p>
                  </div>
                  <span
                    className={`h-fit px-2 py-1 rounded-full text-[10px] font-bold ${h.status === "approved" ? "bg-green-100 text-green-700" : h.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
