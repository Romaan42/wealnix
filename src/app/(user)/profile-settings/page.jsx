"use client";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Wallet,
  Link as LinkIcon,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setUser(json.user);
        setForm({ name: json.user.name || "", phone: json.user.phone || "" });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      alert("Profile Updated!");
      setUser(json.user);
    } else {
      alert(json.error);
    }
  }

  if (loading)
    return (
      <div className="p-10 flex justify-center bg-[#f5f7fb] min-h-screen">
        <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${user?.referralCode}`
      : "";

  return (
    <div className="p-4 w-full lg:p-6 space-y-6 bg-[#f5f7fb] min-h-screen">
      {/* Top Blue Card - Same as Referral Link Card */}
      <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold">Profile Settings</h2>
        <p className="text-[11px] text-white/60 uppercase tracking-widest mt-1">
          Manage Your Account • {user?.rank || "Associate"} • Joined{" "}
          {new Date(user?.createdAt).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-5 text-black">
            <Wallet size={18} className="text-[#1E3A8A]" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              EWALLET
            </p>
            <h3 className="text-2xl font-bold">
              {user?.wallet?.eWallet || 0} WX$
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-5 text-black">
            <Wallet size={18} className="text-[#C5A059]" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              SWALLET
            </p>
            <h3 className="text-2xl font-bold">
              {user?.wallet?.sWallet || 0} WX$
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-5 text-black">
            <Shield size={18} className="text-green-600" />
            <p className="text-[11px] font-bold text-gray-400 uppercase mt-2">
              RANK
            </p>
            <h3 className="text-2xl font-bold">{user?.rank || "Starter"}</h3>
            <p className="text-[11px] text-gray-500 mt-1">
              VP: {user?.volumePoints || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="font-bold text-lg">Personal Information</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-bold">Full Name</label>
              <div className="relative mt-1">
                <User
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold">Email (cannot change)</label>
              <div className="relative mt-1">
                <Mail
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold">Phone Number</label>
              <div className="relative mt-1">
                <Phone
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                  placeholder="0300-XXXXXXX"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-[#1E3A8A] text-white font-bold py-3 rounded-xl hover:bg-[#162c6b] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Right - Referral & Security */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-bold flex items-center gap-2">
              <LinkIcon size={16} /> Your Referral Link
            </h3>
            <div className="mt-3 bg-[#f5f7fb] border rounded-xl p-3 text-[12px] font-mono break-all">
              {referralLink}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="w-full mt-3 bg-[#C5A059] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#A88645]"
            >
              Copy Link
            </button>
            <p className="text-[11px] text-gray-500 mt-2 text-center">
              Share & Earn 10% Direct Commission
            </p>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-bold">Security & KYC</h3>
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span>Status:</span>
                <span
                  className={`font-bold px-2 py-1 rounded-full text-[10px] ${user?.kycStatus === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {user?.kycStatus || "Pending"}
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span>Referral Code:</span>
                <span className="font-mono font-bold">
                  {user?.referralCode}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
