"use client";

import { useState } from "react";

export default function DigitalMatrixSlotsPage() {
  const [balancePKR] = useState(7000); // User wallet balance in PKR

  const slots = [
    {
      id: 1,
      name: "Level 1",
      type: "S6",
      pricePKR: 1500,
      active: true,
      filledSpots: 4,
      maxSpots: 6,
      product: {
        title: "Frontend Mastery Pack",
        category: "Source Code & E-Book",
        items: [
          "HTML/CSS/JS Projects Source Code",
          "Tailwind CSS UI Component Library",
          "Web Development Basics E-Book",
        ],
        icon: "💻",
      },
    },
    {
      id: 2,
      name: "Level 2",
      type: "S6",
      pricePKR: 3000,
      active: true,
      filledSpots: 2,
      maxSpots: 6,
      product: {
        title: "MERN Stack Starter Kit",
        category: "Full Stack Templates",
        items: [
          "React & Next.js SaaS Starter Kits",
          "Express & MongoDB Auth Boilerplate",
          "REST API Development Guide",
        ],
        icon: "🚀",
      },
    },
    {
      id: 3,
      name: "Level 3",
      type: "S3",
      pricePKR: 6000,
      active: false,
      filledSpots: 0,
      maxSpots: 3,
      product: {
        title: "UI/UX Design & Graphic Assets Bundle",
        category: "Design System",
        items: [
          "Figma UI Kit & App Designs",
          "1000+ Premium Graphic Assets",
          "Photoshop & CorelDraw Templates",
        ],
        icon: "🎨",
      },
    },
    {
      id: 4,
      name: "Level 4",
      type: "S6",
      pricePKR: 12000,
      active: false,
      filledSpots: 0,
      maxSpots: 6,
      product: {
        title: "E-Commerce Masterclass & App Suite",
        category: "Course & Full Project",
        items: [
          "Complete E-Commerce Web App Code",
          "Payment Gateway Integration Guide",
          "SEO & Digital Marketing Toolkit",
        ],
        icon: "🛒",
      },
    },
    {
      id: 5,
      name: "Level 5",
      type: "S6",
      pricePKR: 24000,
      active: false,
      filledSpots: 0,
      maxSpots: 6,
      product: {
        title: "Freelancing & Client Acquisition Bundle",
        category: "Business Strategy",
        items: [
          "Upwork & Kwork Winning Proposals",
          "Client Management CRM Tool",
          "1-on-1 Mentorship Session Access",
        ],
        icon: "💼",
      },
    },
    {
      id: 6,
      name: "Level 6",
      type: "S3",
      pricePKR: 48000,
      active: false,
      filledSpots: 0,
      maxSpots: 3,
      product: {
        title: "SaaS Enterprise Solution Kit",
        category: "Full System License",
        items: [
          "Multi-Tenant Software Source Code",
          "Cloud Server Deployment Scripts",
          "Commercial Reseller Rights",
        ],
        icon: "⚡",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                Matrix + Digital Products Plan
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Unlock Slots & Digital Products
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Har level activate karne par aapko Matrix slots ke sath premium
              digital products ka instant access milega.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Wallet Balance
              </p>
              <p className="text-lg font-mono font-bold text-emerald-400">
                Rs. {balancePKR.toLocaleString()}
              </p>
            </div>
            <a
              href="/deposit"
              className="px-4 py-2 text-xs font-bold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              + Deposit
            </a>
          </div>
        </div>

        {/* Matrix & Digital Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all ${
                slot.active
                  ? "bg-slate-900/90 border-emerald-500/50 shadow-xl shadow-emerald-500/5"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                {/* Level Title & Matrix Type Badge */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{slot.product.icon}</span>
                    <div>
                      <span className="text-xs font-bold text-emerald-400">
                        {slot.name}
                      </span>
                      <h3 className="text-base font-extrabold text-white leading-tight">
                        {slot.type} Matrix
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                      slot.active
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {slot.active ? "Active & Unlocked" : "Locked"}
                  </span>
                </div>

                {/* Digital Product Details Box */}
                <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Included Product
                    </span>
                    <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      {slot.product.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-2">
                    {slot.product.title}
                  </h4>
                  <ul className="space-y-1">
                    {slot.product.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-[11px] text-slate-400 flex items-center gap-1.5"
                      >
                        <span className="text-emerald-400 font-bold">✓</span>{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Matrix Spots Visualization */}
                <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/50 mb-5">
                  <p className="text-[10px] text-slate-400 mb-2 text-center font-medium">
                    Matrix Spots Progress ({slot.filledSpots}/{slot.maxSpots})
                  </p>
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: slot.maxSpots }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all ${
                          idx < slot.filledSpots
                            ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/30"
                            : "bg-slate-900 border-slate-800 text-slate-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    Unlock Cost
                  </p>
                  <p className="text-base font-mono font-bold text-emerald-400">
                    Rs. {slot.pricePKR.toLocaleString()}
                  </p>
                </div>

                {slot.active ? (
                  <button className="px-3.5 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-lg hover:bg-emerald-500/30 transition-all flex items-center gap-1">
                    <span>📥</span> Download Assets
                  </button>
                ) : (
                  <button
                    disabled={balancePKR < slot.pricePKR}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      balancePKR >= slot.pricePKR
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {balancePKR >= slot.pricePKR
                      ? "Activate & Get Product"
                      : "Low Balance"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
