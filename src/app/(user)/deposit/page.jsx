"use client";

import { useState } from "react";

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState("easypaisa");
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const paymentMethods = {
    easypaisa: {
      title: "Easypaisa",
      accountName: "Meta Force Admin",
      accountNumber: "0300-1234567",
      color: "border-green-500 bg-green-500/10 text-green-400",
      badge: "Fast Approval",
    },
    jazzcash: {
      title: "JazzCash",
      accountName: "Meta Force Admin",
      accountNumber: "0301-7654321",
      color: "border-red-500 bg-red-500/10 text-red-400",
      badge: "Instant",
    },
    bank: {
      title: "Bank Transfer (Meezan Bank)",
      accountName: "Meta Force Global Pvt Ltd",
      accountNumber: "0102-0102938481",
      iban: "PK36MEZN0001020102938481",
      color: "border-blue-500 bg-blue-500/10 text-blue-400",
      badge: "High Limits",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !trxId) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            Local Payment Deposit
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Deposit PKR via Easypaisa, JazzCash, or Bank Transfer to activate
            your Matrix Slots.
          </p>
        </div>

        {/* Step 1: Select Payment Gateway */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            1. Select Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.keys(paymentMethods).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setSelectedMethod(method)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedMethod === method
                    ? paymentMethods[method].color
                    : "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-400"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-base">
                    {paymentMethods[method].title.split(" ")[0]}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {paymentMethods[method].badge}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Local PKR Transfer
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Account Details Box */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-3 bg-gradient-to-br from-slate-900 to-slate-900/50">
          <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            Send Payment to this Account
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-1">
            <div>
              <p className="text-slate-400 text-xs">Account Title</p>
              <p className="font-bold text-slate-100">
                {paymentMethods[selectedMethod].accountName}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Account / Mobile Number</p>
              <p className="font-mono font-bold text-emerald-300 text-base">
                {paymentMethods[selectedMethod].accountNumber}
              </p>
            </div>
            {paymentMethods[selectedMethod].iban && (
              <div className="sm:col-span-2">
                <p className="text-slate-400 text-xs">IBAN Number</p>
                <p className="font-mono text-slate-200 text-xs">
                  {paymentMethods[selectedMethod].iban}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Deposit Form */}
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-6 text-center space-y-3">
            <div className="text-3xl">✅</div>
            <h3 className="text-lg font-bold text-emerald-400">
              Deposit Request Submitted!
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your transaction ID{" "}
              <span className="font-mono text-white bg-slate-900 px-2 py-1 rounded">
                {trxId}
              </span>{" "}
              is under manual verification by admin. Slots will activate
              shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg"
            >
              Submit Another Deposit
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5"
          >
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              2. Enter Transaction Details
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Deposit Amount (PKR)
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 3500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Transaction ID (TrxID / Ref No.)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 92837102938"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Payment Proof Screenshot (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-lg p-2 cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-slate-800 file:text-slate-300 file:text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Submit Deposit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
