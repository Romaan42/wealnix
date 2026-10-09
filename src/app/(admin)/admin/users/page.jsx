// app/admin/users/page.jsx
"use client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [walletForm, setWalletForm] = useState({
    type: "eWallet",
    amount: "",
    operation: "add",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?search=${search}&status=${statusFilter}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      if (data.success) setUsers(data.users);
      else toast.error(data.error);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleAction = async (id, action, value) => {
    const tId = toast.loading("Updating...");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, value }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { id: tId });
        fetchUsers();
        setSelectedUser(null);
      } else {
        toast.error(data.error, { id: tId });
      }
    } catch {
      toast.error("Action failed", { id: tId });
    }
  };

  const handleWalletAdjust = async () => {
    if (!walletForm.amount || parseFloat(walletForm.amount) <= 0) {
      toast.error("Amount dalo");
      return;
    }
    await handleAction(selectedUser._id, "wallet", walletForm);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-sm text-gray-500">
            Total: {users.length} users | Freeze, Wallet Adjust, Rank Override
          </p>
        </div>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search username, email, phone..."
              className="border rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-full text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "active", "suspended", "unverified"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize border ${statusFilter === s ? "bg-black text-white border-black" : "bg-white text-gray-600"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-[11px] uppercase text-gray-500 tracking-widest">
                <tr>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4">Wallet</th>
                  <th className="py-3 px-4">Bundle / Rank / Team</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-bold">@{u.userName}</p>
                      <p className="text-xs text-gray-600">{u.name || "-"}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      <p className="text-xs text-gray-500">{u.number}</p>
                      <p className="text-[11px] mt-1">
                        Sponsor: {u.sponsor?.userName || "Direct (Company)"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs">
                        E:{" "}
                        <span className="font-bold">
                          WX$ {u.wallet?.eWallet?.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-xs">
                        S:{" "}
                        <span className="font-bold">
                          WX$ {u.wallet?.sWallet?.toFixed(2)}
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Withdrawn: WX$ {u.wallet?.totalWithdrawn?.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        PKR {(u.wallet?.eWallet * 100).toLocaleString()} avail
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs">
                        Bundle:{" "}
                        <span className="font-bold">WX$ {u.currentBundle}</span>
                      </p>
                      <p className="text-xs">Rank: {u.rank}</p>
                      <p className="text-xs">VP: {u.volumePoints}</p>
                      <p className="text-[11px] text-gray-500">
                        Direct: {u.stats?.directTeam} | Total:{" "}
                        {u.stats?.totalTeam}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full capitalize ${u.status === "active" ? "bg-green-100 text-green-700" : u.status === "suspended" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="bg-black text-white px-3 py-1.5 rounded-lg text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manage Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Manage @{selectedUser.userName}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Status Control */}
            <div className="border rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold uppercase text-gray-500">
                Status Control (Freeze)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleAction(selectedUser._id, "status", "active")
                  }
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs"
                >
                  Active
                </button>
                <button
                  onClick={() =>
                    handleAction(selectedUser._id, "status", "suspended")
                  }
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs"
                >
                  Suspend (Freeze)
                </button>
                <button
                  onClick={() =>
                    handleAction(selectedUser._id, "status", "unverified")
                  }
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-xs"
                >
                  Unverified
                </button>
              </div>
            </div>

            {/* Wallet Adjust */}
            <div className="border rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase text-gray-500">
                Wallet Adjustment (Manual Credit/Debit)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={walletForm.type}
                  onChange={(e) =>
                    setWalletForm({ ...walletForm, type: e.target.value })
                  }
                  className="border rounded-lg px-2 py-2 text-xs"
                >
                  <option value="eWallet">E-Wallet (Withdrawable)</option>
                  <option value="sWallet">S-Wallet (Locked)</option>
                </select>
                <select
                  value={walletForm.operation}
                  onChange={(e) =>
                    setWalletForm({ ...walletForm, operation: e.target.value })
                  }
                  className="border rounded-lg px-2 py-2 text-xs"
                >
                  <option value="add">+ Add</option>
                  <option value="subtract">- Subtract</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Amount WX$"
                value={walletForm.amount}
                onChange={(e) =>
                  setWalletForm({ ...walletForm, amount: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleWalletAdjust}
                className="w-full bg-black text-white py-2 rounded-lg text-sm"
              >
                Update Wallet
              </button>
              <p className="text-[11px] text-gray-400">
                Use for compensation or penalty. PKR = WX$ * 100
              </p>
            </div>

            {/* Rank & Bundle Override */}
            <div className="border rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase text-gray-500">
                Rank & Bundle Override
              </p>
              <div className="flex gap-2">
                <select
                  defaultValue={selectedUser.rank}
                  id="rankSelect"
                  className="flex-1 border rounded-lg px-2 py-2 text-xs"
                >
                  <option>Beginner</option>
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                  <option>Diamond</option>
                </select>
                <button
                  onClick={() =>
                    handleAction(
                      selectedUser._id,
                      "rank",
                      document.getElementById("rankSelect").value,
                    )
                  }
                  className="bg-gray-900 text-white px-3 rounded-lg text-xs"
                >
                  Update Rank
                </button>
              </div>
              <div className="flex gap-2">
                <select
                  defaultValue={selectedUser.currentBundle}
                  id="bundleSelect"
                  className="flex-1 border rounded-lg px-2 py-2 text-xs"
                >
                  <option value="0">0 - No Bundle</option>
                  <option value="20">20 - Starter</option>
                  <option value="50">50 - Silver</option>
                  <option value="100">100 - Gold</option>
                  <option value="150">150 - Platinum</option>
                  <option value="200">200 - Diamond</option>
                </select>
                <button
                  onClick={() =>
                    handleAction(
                      selectedUser._id,
                      "bundle",
                      document.getElementById("bundleSelect").value,
                    )
                  }
                  className="bg-gray-900 text-white px-3 rounded-lg text-xs"
                >
                  Update Bundle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
