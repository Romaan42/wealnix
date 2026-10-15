"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    identifier: "", // email or username - PDF me dono allowed
    password: "",
    remember: false,
  });

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

    if (!formData.identifier || !formData.password) {
      return setError("Email/Username aur Password zaroori hai");
    }

    setLoading(true);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result = await res.json();

    setLoading(false);
    if (result.success) {
      router.push("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f7fb]">
      {/* Left - Same Branding */}
      <Toaster />
      <div className="hidden lg:flex w-[45%] bg-[#1E3A8A] relative flex-col justify-between p-10 text-white">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#C5A059] rounded-lg flex items-center justify-center font-bold text-[#1E3A8A]">
              W
            </div>
            <h1 className="text-2xl font-bold">Wealnex</h1>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-[36px] font-bold leading-tight">
              Welcome <br /> <span className="text-[#C5A059]">Back</span>
            </h2>

            <div className="flex gap-6 mt-6 text-xs">
              <span className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#C5A059]" /> WX$ 192 Avg
                Earnings
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-[#C5A059]" /> 50k+ Members
              </span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-white/40">
          © 2026 Wealnex Corporation. WX$ Engine Active
        </p>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#1E3A8A] rounded-lg flex items-center justify-center font-bold text-white">
              W
            </div>
            <h1 className="text-xl font-bold text-[#1E3A8A]">Wealnex</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-[26px] font-bold text-[#1E293B]">
              Login to Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your credentials to access dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[12px] font-semibold text-gray-600 mb-1.5 block">
                Email or Username
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  placeholder="alex@wealnex.com or alex123"
                  type="text"
                  className="w-full pl-10 pr-3 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[12px] font-semibold text-gray-600">
                  Password
                </label>
                {/* <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#C5A059] font-semibold"
                >
                  Forgot Password?
                </Link> */}
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
                  placeholder="••••••••"
                  type={showPass ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10 bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-[#1E3A8A]"
                />
                Remember me
              </label>
              <span className="text-gray-400">Secure login • WX$</span>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#1E3A8A] hover:bg-[#162c6b] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#1E3A8A]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Logging in...
                </>
              ) : (
                <>
                  Login to Dashboard <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have account?{" "}
            <Link href="/register" className="text-[#1E3A8A] font-bold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
