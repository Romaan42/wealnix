// app/admin/users/page.jsx
"use client";
import { deleteUser } from "@/actions/adminActions";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  console.log(users);
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
        // Modal update
        setSelectedUser((prev) => ({ ...prev, ...data.updatedUser }));
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

  const handleDeleteUser = async (id) => {
    if (confirm("do you want to delete the user")) {
      setLoading(true);
      const res = await deleteUser(id);
      setLoading(false);
      if (res.success) {
        toast.success(res.message);
        fetchUsers();
      }
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      {/* Header + Search + Filters - same as yours */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-sm text-gray-500">Total: {users.length} users</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-full px-4 py-2 text-sm w-64"
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

      {/* Table - same */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {/* ... tumhara table same rahega ... */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-[11px] uppercase text-gray-500">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4">Wallet</th>
                <th className="py-3 px-4">KYC</th>
                <th className="py-3 px-4">Bundle/Rank</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-bold">@{u.userName}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    E: WX$ {u.wallet?.eWallet?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full ${u.kycStatus === "verified" ? "bg-green-100 text-green-700" : u.kycStatus === "submitted" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}
                    >
                      {u.kycStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {u.currentBundle} - {u.rank}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] px-2 py-1 rounded-full ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <Trash
                      className="text-red-500 cursor-pointer w-4"
                      onClick={() => handleDeleteUser(u._id)}
                    />
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="bg-black text-white px-3 py-1 rounded-lg text-xs"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANAGE MODAL - UPDATED WITH CNIC */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Manage @{selectedUser.userName}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* === NEW: CNIC / KYC DETAILS === */}
            <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between">
                <p className="text-xs font-bold uppercase text-gray-500">
                  KYC & CNIC Details
                </p>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${selectedUser.kycStatus === "verified" ? "bg-green-600 text-white" : "bg-yellow-500 text-white"}`}
                >
                  {selectedUser.kycStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400">Full Name</p>
                  <p className="font-bold">{selectedUser.name || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400">CNIC</p>
                  <p className="font-bold">
                    {selectedUser.cnic || "Not Provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">DOB</p>
                  <p>{selectedUser.dob || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400">City</p>
                  <p>{selectedUser.city || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Address</p>
                  <p>{selectedUser.address || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p>{selectedUser.number || selectedUser.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="truncate">{selectedUser.email}</p>
                </div>
              </div>

              {/* CNIC Images */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Front Side</p>
                  {selectedUser.cnicFront ? (
                    <img
                      src={selectedUser.cnicFront}
                      alt="CNIC Front"
                      className="w-full h-28 object-cover rounded-lg border cursor-pointer"
                      onClick={() => window.open(selectedUser.cnicFront)}
                    />
                  ) : (
                    <div className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center text-[11px]">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Back Side</p>
                  {selectedUser.cnicBack ? (
                    <img
                      src={selectedUser.cnicBack}
                      alt="CNIC Back"
                      className="w-full h-28 object-cover rounded-lg border cursor-pointer"
                      onClick={() => window.open(selectedUser.cnicBack)}
                    />
                  ) : (
                    <div className="w-full h-28 bg-gray-200 rounded-lg flex items-center justify-center text-[11px]">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              {/* KYC Actions */}
              {selectedUser.kycStatus === "submitted" && (
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAction(selectedUser._id, "kyc", "verified")
                    }
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold"
                  >
                    ✓ Verify KYC
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Rejection reason?");
                      if (reason)
                        handleAction(selectedUser._id, "kyc", {
                          status: "rejected",
                          reason,
                        });
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
              {selectedUser.kycReason && (
                <p className="text-[11px] text-red-500 bg-red-50 p-2 rounded">
                  Reason: {selectedUser.kycReason}
                </p>
              )}
            </div>

            {/* Status Control */}
            <div className="border rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold uppercase text-gray-500">
                Status Control
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
                  Suspend
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

            {/* Wallet + Rank - Tumhara purana code same yahan rahega */}
            <div className="border rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase text-gray-500">
                Wallet Adjustment
              </p>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={walletForm.type}
                  onChange={(e) =>
                    setWalletForm({ ...walletForm, type: e.target.value })
                  }
                  className="border rounded-lg px-2 py-2 text-xs"
                >
                  <option value="eWallet">E-Wallet</option>
                  <option value="sWallet">S-Wallet</option>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
