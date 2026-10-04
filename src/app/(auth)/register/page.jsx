"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";

const WX_RATE = 100;
const BUNDLES = [
  { name: "Starter", priceWX: 20, pkr: 2000 },
  { name: "Silver", priceWX: 50, pkr: 5000 },
  { name: "Gold", priceWX: 100, pkr: 10000 },
  { name: "Platinum", priceWX: 150, pkr: 15000 },
  { name: "Diamond", priceWX: 200, pkr: 20000 },
];

// 1. Saara logic is component me
function RegisterFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    number: "",
    sponsorId: "",
    password: "",
    bundleWX: 100,
    agree: false,
  });

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setFormData((prev) => ({ ...prev, sponsorId: ref }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.agree) return setError("Terms accept karna zaroori hai");
    if (formData.password.length < 6) return setError("Password min 6 chars");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          userName: formData.userName,
          email: formData.email,
          number: formData.number,
          sponsorUserName: formData.sponsorId,
          password: formData.password,
          bundlePriceWX: Number(formData.bundleWX),
          plan: {
            name: BUNDLES.find((b) => b.priceWX == formData.bundleWX)?.name,
            price: Number(formData.bundleWX),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Register failed");
      alert(
        `Success! WX$ ${formData.bundleWX} (PKR ${formData.bundleWX * WX_RATE})`,
      );
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f7fb]">
      <div className="hidden lg:flex w-[45%] bg-[#1E3A8A] relative flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#C5A059] rounded-lg flex items-center justify-center font-bold text-[#1E3A8A]">
            W
          </div>
          <h1 className="text-2xl font-bold">Wealnex</h1>
        </div>
        <div className="space-y-6">
          <h2 className="text-[38px] font-bold leading-tight">
            Build Your <br />
            <span className="text-[#C5A059]">Financial Future</span>
            <br />
            With Wealnex
          </h2>
          <p className="text-white/60 text-sm max-w-[400px]">
            5 Level commissions - 1 WX$ = {WX_RATE} PKR. Bundle price in WX$.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {BUNDLES.slice(0, 3).map((b) => (
              <div
                key={b.priceWX}
                className={`rounded-xl p-3 border ${formData.bundleWX == b.priceWX ? "bg-[#C5A059] border-[#C5A059] text-white" : "bg-white/10 border-white/10"}`}
              >
                <p className="font-bold text-sm">{b.name}</p>
                <p className="text-xs opacity-80">
                  WX$ {b.priceWX} = PKR {b.pkr}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-white/40">
          © 2026 Wealnex Corp. WX$ Engine Active
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          <div className="mb-6">
            <h2 className="text-[26px] font-bold text-[#1E293B]">
              Create Account
            </h2>
            {formData.sponsorId && (
              <p className="text-sm text-gray-500 mt-1">
                Sponsor:{" "}
                <span className="text-[#C5A059] font-bold">
                  {formData.sponsorId}
                </span>{" "}
                ✅
              </p>
            )}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-600">
                SELECT BUNDLE (WX$ = PKR)
              </label>
              <select
                name="bundleWX"
                value={formData.bundleWX}
                onChange={handleChange}
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 text-sm font-bold bg-white focus:border-[#1E3A8A]"
              >
                {BUNDLES.map((b) => (
                  <option key={b.priceWX} value={b.priceWX}>
                    {b.name} - WX$ {b.priceWX} (PKR {b.priceWX * WX_RATE}) -{" "}
                    {b.priceWX / 10} VP
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#1E3A8A] outline-none"
                />
              </div>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  placeholder="Username"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#1E3A8A] outline-none"
                />
              </div>
            </div>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#1E3A8A] outline-none"
              />
            </div>
            <div className="relative">
              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                placeholder="Phone e.g. 03001234567"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#1E3A8A] outline-none"
              />
            </div>
            <div className="relative">
              <Users
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="sponsorId"
                value={formData.sponsorId}
                onChange={handleChange}
                placeholder="Sponsor ID (Optional)"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#C5A059]/50 bg-[#C5A059]/5 text-sm font-semibold text-[#8B6B2E] outline-none"
              />
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                type={showPass ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:border-[#1E3A8A] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="rounded"
              />{" "}
              I agree to{" "}
              <Link href="#" className="text-[#1E3A8A] font-semibold underline">
                Terms
              </Link>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#1E3A8A] hover:bg-[#162c6b] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Creating...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have account?{" "}
            <Link href="/login" className="text-[#1E3A8A] font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// 2. Main Export - Suspense wrapper + dynamic
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
          <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
