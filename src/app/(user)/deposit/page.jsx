"use client";
import { useState, useEffect } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle,
  Crown,
  Zap,
  Award,
  Gem,
  Diamond,
} from "lucide-react";
import PagesLoader from "@/components/PagesLoader";
import toast from "react-hot-toast";

const WX_RATE = 100;

const BUNDLES = [
  {
    id: 20,
    name: "Starter",
    priceWX: 20,
    pricePKR: 2000,
    vp: 2,
    icon: Zap,
    color: "border-gray-300",
    bg: "bg-gray-50",
    desc: "Basic Personal Access",
  },
  {
    id: 50,
    name: "Silver",
    priceWX: 50,
    pricePKR: 5000,
    vp: 5,
    icon: Award,
    color: "border-slate-400",
    bg: "bg-slate-50",
    desc: "Standard Resell Rights",
  },
  {
    id: 100,
    name: "Gold",
    priceWX: 100,
    pricePKR: 10000,
    vp: 10,
    icon: Crown,
    color: "border-[#C5A059]",
    bg: "bg-[#C5A059]/10",
    desc: "Master Resell Rights (MRR)",
    popular: true,
  },
  {
    id: 150,
    name: "Platinum",
    priceWX: 150,
    pricePKR: 15000,
    vp: 15,
    icon: Gem,
    color: "border-purple-400",
    bg: "bg-purple-50",
    desc: "Full White Label Rights",
  },
  {
    id: 200,
    name: "Diamond",
    priceWX: 200,
    pricePKR: 20000,
    vp: 20,
    icon: Diamond,
    color: "border-cyan-400",
    bg: "bg-cyan-50",
    desc: "White Label + Agency Master",
  },
];

export default function DepositGatewayPage() {
  const [data, setData] = useState({
    wallet: { eWallet: 0, sWallet: 0 },
    history: [],
    stats: { total: 0, pending: 0, success: 0 },
  });
  const [selectedBundle, setSelectedBundle] = useState(BUNDLES[2]); // Default Gold
  const [amountPKR, setAmountPKR] = useState(10000);
  const [method, setMethod] = useState("jazzcash");
  const [trxId, setTrxId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleBundleSelect = (bundle) => {
    setSelectedBundle(bundle);
    setAmountPKR(bundle.pricePKR);
  };

  const wxAmount = selectedBundle.priceWX;

  const handleSubmit = async () => {
    if (!trxId.trim()) return alert("Please enter Transaction ID");

    setSubmitting(true);
    try {
      const res = await fetch("/api/deposit/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundlePriceWX: selectedBundle.priceWX, // bas yahi bhejo, baaki backend khud nikal lega
          method,
          trxId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      toast.success(
        `Success! ${selectedBundle.name} Bundle (${selectedBundle.priceWX} WX$) request submitted. You will get ${selectedBundle.vp} VP after approval.`,
      );
      setTrxId("");
      const historyRes = await fetch("/api/deposit/history");
      const historyJson = await historyRes.json();
      setData((d) => ({
        ...d,
        history: historyJson.history,
        stats: historyJson.stats,
      }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PagesLoader />;

  const methods = [
    {
      id: "jazzcash",
      name: "JazzCash",
      desc: "Pay via JazzCash • Instant",
      acc: "0300-1234567",
    },
    {
      id: "easypaisa",
      name: "EasyPaisa",
      desc: "Pay via EasyPaisa • Instant",
      acc: "0345-1234567",
    },
    {
      id: "usdt",
      name: "USDT (TRC20)",
      desc: "Crypto via USDT • Min 10 USDT",
      acc: "TXyz...Abc123",
    },
  ];

  return (
    <div className="p-4 w-full lg:p-6 space-y-6 bg-[#f5f7fb] min-h-screen">
      <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">Deposit Gateway - Bundle Purchase</h2>
        <p className="text-[11px] text-white/60 uppercase tracking-widest mt-1">
          eWallet: {data.wallet.eWallet} WX$ • sWallet: {data.wallet.sWallet}{" "}
          WX$ • 1 WX$ = {WX_RATE} PKR
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-5 text-black">
            <DollarSign size={18} className="text-[#1E3A8A]" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              TOTAL DEPOSITED
            </p>
            <h3 className="text-2xl font-bold">{data.stats.total} PKR</h3>
          </div>
          <div className="bg-white rounded-2xl p-5 text-black">
            <Clock size={18} className="text-[#C5A059]" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              PENDING
            </p>
            <h3 className="text-2xl font-bold">{data.stats.pending} PKR</h3>
          </div>
          <div className="bg-white rounded-2xl p-5 text-black">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              SUCCESSFUL
            </p>
            <h3 className="text-2xl font-bold">{data.stats.success} PKR</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="font-bold text-lg">Select Bundle Plan</h2>
            <p className="text-xs text-gray-500 mt-1">
              Choose your package - Commission & VP as per Blueprint Page 1
            </p>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {BUNDLES.map((b) => {
              const Icon = b.icon;
              const isSelected = selectedBundle.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => handleBundleSelect(b)}
                  className={`text-left p-4 rounded-xl border-2 transition relative ${isSelected ? "border-[#1E3A8A] bg-[#1E3A8A]/5" : `${b.color} ${b.bg} hover:border-[#1E3A8A]/50`}`}
                >
                  {b.popular && (
                    <span className="absolute -top-2 right-3 bg-[#C5A059] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                      MOST POPULAR
                    </span>
                  )}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#1E3A8A] text-white" : "bg-white border"}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{b.name} Bundle</p>
                        <p className="text-[11px] text-gray-500">{b.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-lg font-bold">WX$ {b.priceWX}</p>
                      <p className="text-[11px] text-gray-500">
                        PKR {b.pricePKR.toLocaleString()} • {b.vp} VP
                      </p>
                    </div>
                    <p className="text-[10px] font-bold text-[#1E3A8A]">
                      {b.vp} VP GRANTED
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-5 border-t space-y-4">
            <p className="font-bold text-sm">Select Payment Method</p>
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full text-left p-4 rounded-xl border-2 flex justify-between items-center ${method === m.id ? "border-[#1E3A8A] bg-[#1E3A8A]/5" : "border-gray-200"}`}
              >
                <div>
                  <p className="font-bold text-sm">
                    {m.name} •{" "}
                    <span className="font-mono text-[11px]">{m.acc}</span>
                  </p>
                  <p className="text-[12px] text-gray-500">{m.desc}</p>
                </div>
                {method === m.id && (
                  <div className="w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </button>
            ))}

            <div>
              <p className="font-bold text-sm mb-2">Transaction ID (TrxID)</p>
              <input
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="JC1234567890 ya Txn Hash"
                className="w-full bg-gray-100 border rounded-xl px-4 py-3 outline-none focus:border-[#1E3A8A] text-sm"
              />
            </div>

            <div className="bg-[#C5A059]/15 border border-[#C5A059]/30 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">You selected</p>
                <p className="text-xl font-bold text-[#8B6B2E]">
                  {selectedBundle.name} - {wxAmount} WX$
                </p>
                <p className="text-[11px] text-gray-500">
                  {selectedBundle.pricePKR} PKR / {WX_RATE} +{" "}
                  {selectedBundle.vp} VP
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">You will get:</p>
                <p className="text-xs font-bold">
                  {selectedBundle.vp} VP + {selectedBundle.name} Access
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#C5A059] text-white font-bold py-3.5 rounded-xl hover:bg-[#A88645] disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : `Pay PKR ${selectedBundle.pricePKR.toLocaleString()} for ${selectedBundle.name}`}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-5 h-fit">
          <h3 className="font-bold text-lg">Recent Deposits</h3>
          <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto">
            {data.history.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-6">
                No deposits yet
              </p>
            )}
            {data.history.slice(0, 10).map((h, i) => (
              <div
                key={i}
                className="flex justify-between text-[12px] border-b pb-2"
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
  );
}
