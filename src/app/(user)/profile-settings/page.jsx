"use client";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Wallet,
  Link as LinkIcon,
  MapPin,
  Calendar,
  CreditCard,
  Camera,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refLink, setRefLink] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cnic: "",
    dob: "",
    address: "",
    city: "",
    profilePic: "",
    cnicFront: "",
    cnicBack: "",
  });

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
        setForm({
          name: json.user.name || "",
          phone: json.user.phone || "",
          cnic: json.user.cnic || "",
          dob: json.user.dob ? json.user.dob.split("T")[0] : "",
          address: json.user.address || "",
          city: json.user.city || "",
          profilePic: json.user.profilePic || "",
          cnicFront: json.user.cnicFront || "",
          cnicBack: json.user.cnicBack || "",
        });
        setRefLink(json.referralLink);
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
    } else alert(json.error);
  }

  if (loading)
    return (
      <div className="p-10 w-full flex justify-center bg-[#f5f7fb] min-h-screen">
        <div className="w-8 h-8 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const UploadCard = ({ label, value, field, folder }) => (
    <CldUploadWidget
      uploadPreset="talha-sabeeh"
      options={{ folder: `wealnix/kyc/${folder}`, resourceType: "image" }}
      onSuccess={(r) => setForm({ ...form, [field]: r.info.secure_url })}
    >
      {({ open }) => (
        <div
          onClick={() => open()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-[#1E3A8A] hover:bg-blue-50/50 transition group"
        >
          {value ? (
            <div className="relative">
              <img
                src={value}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
                <Camera className="text-white" />
              </div>
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <CheckCircle2 size={12} />
              </div>
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Upload size={20} />
              <p className="text-xs font-bold">{label}</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );

  // if (user.kycStatus === "verified") {
  //   return (
  //     <div className="w-full h-screen flex justify-center items-center">
  //       <h1>Kyc is completed</h1>
  //     </div>
  //   );
  // }
  return (
    <div className="p-4 w-full lg:p-6 space-y-6 bg-[#f5f7fb] min-h-screen">
      {/* Top Blue Card */}
      <div className="bg-[#1E3A8A] rounded-2xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Profile Settings</h2>
            <p className="text-[11px] text-white/60 uppercase tracking-widest mt-1">
              Manage Your Account • {user?.rank || "Associate"} • Joined{" "}
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-white/30 overflow-hidden bg-white">
              {form.profilePic ? (
                <img
                  src={form.profilePic}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#C5A059] text-white font-bold text-xl">
                  {user?.name?.[0] || "U"}
                </div>
              )}
            </div>
          </div>
        </div>

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
        {/* Left Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <User size={18} />
              Personal Information
            </h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-bold">Profile Picture</label>
                <div className="mt-2">
                  <UploadCard
                    label="Upload Profile Picture"
                    value={form.profilePic}
                    field="profilePic"
                    folder="profile"
                  />
                </div>
              </div>

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
                <label className="text-sm font-bold">Phone Number</label>
                <div className="relative mt-1">
                  <Phone
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                    placeholder="0300-XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold">CNIC Number</label>
                <div className="relative mt-1">
                  <CreditCard
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    value={form.cnic}
                    onChange={(e) => setForm({ ...form, cnic: e.target.value })}
                    maxLength={15}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                    placeholder="42101-XXXXXXX-X"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold">Date of Birth</label>
                <div className="relative mt-1">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-bold">
                  Email (cannot change)
                </label>
                <div className="relative mt-1">
                  <Mail
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold">City</label>
                <div className="relative mt-1">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                    placeholder="Karachi"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold">Full Address</label>
                <div className="relative mt-1">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1E3A8A]"
                    placeholder="House #, Street"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6 bg-[#1E3A8A] text-white font-bold py-3 rounded-xl hover:bg-[#162c6b] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* CNIC Upload */}
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <CreditCard size={18} />
              CNIC Verification (KYC)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Upload clear pictures of your CNIC for verification
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs font-bold mb-2 block">
                  CNIC Front Side
                </label>
                {user.kycStatus === "verified" ? (
                  <img
                    className="w-full h-32 object-cover rounded-lg"
                    src={form.cnicFront}
                    alt="cnic"
                  />
                ) : (
                  <UploadCard
                    label="Front Side"
                    value={form.cnicFront}
                    field="cnicFront"
                    folder="cnic"
                  />
                )}
              </div>
              <div>
                <label className="text-xs font-bold mb-2 block">
                  CNIC Back Side
                </label>
                {user.kycStatus === "verified" ? (
                  <img
                    className="w-full h-32 object-cover rounded-lg"
                    src={form.cnicBack}
                    alt="cnic"
                  />
                ) : (
                  <UploadCard
                    label="Back Side"
                    value={form.cnicBack}
                    field="cnicBack"
                    folder="cnic"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm p-5">
            <h3 className="font-bold flex items-center gap-2">
              <LinkIcon size={16} /> Your Referral Link
            </h3>
            <div className="mt-3 bg-[#f5f7fb] border rounded-xl p-3 text-[12px] font-mono break-all">
              {refLink}
            </div>
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(refLink)
                  .then(() => toast.success("link copied"))
              }
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
            <div className="mt-3 space-y-3 text-[12px]">
              <div className="flex justify-between items-center bg-[#f5f7fb] p-3 rounded-xl">
                <span>Status:</span>
                <span
                  className={`font-bold px-3 py-1 rounded-full text-[10px] ${user?.kycStatus === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {user?.kycStatus || "Pending"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>CNIC:</span>
                <span className="font-mono font-bold">
                  {form.cnic ? "••••-" + form.cnic.slice(-4) : "Not added"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Docs:</span>
                <span className="font-bold">
                  {form.cnicFront && form.cnicBack
                    ? "✅ Uploaded"
                    : "❌ Missing"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
