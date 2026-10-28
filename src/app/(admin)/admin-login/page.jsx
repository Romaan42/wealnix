"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Ye refresh rokta hai
    if (!identifier || !password) {
      toast.error("Username/Email and password required");
      return;
    }

    setLoading(true);
    toast.loading("Verifying admin credentials...", { id: "admin-login" });

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: identifier, password }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message || "Welcome Admin! Redirecting...", {
          id: "admin-login", // same ID se loading replace hoga
          duration: 2000,
          icon: "👑",
        });
        router.push("/admin");
      } else {
        toast.error(result.message || "Login failed", {
          id: "admin-login",
          duration: 4000,
        });
      }
    } catch (err) {
      toast.error("Server error", { id: "admin-login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-[24px] p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-widest">WEALNEX</h1>
          <p className="text-[11px] text-gray-400 tracking-[0.3em] uppercase mt-1">
            Admin Control Center
          </p>
          <div className="mt-4 inline-block bg-black text-white text-[10px] px-3 py-1 rounded-full">
            1 WX$ = PKR 100 | SECURE LOGIN
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">
              Admin Username / Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@wealnex.com or admin username"
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login to Admin Panel"}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-6">
          Only users with role=admin can login here. User login is at /login
        </p>
      </div>
    </div>
  );
}
