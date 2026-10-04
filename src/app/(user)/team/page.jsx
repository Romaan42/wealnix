"use client";

import { useState } from "react";
import Link from "next/link";

export default function MyTeamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("all");

  // Team Summary Stats
  const teamStats = {
    directPartners: 12,
    totalTeam: 48,
    activeTeamMembers: 42,
    teamTurnoverPKR: 126000,
  };

  // Team Members Data
  const teamMembers = [
    {
      id: "MF-84931",
      name: "Ali Ahmed",
      mobile: "0300-1122334",
      joinedDate: "28 Sep 2026",
      activeLevel: 3,
      matrixType: "S3",
      directCount: 5,
      totalEarnedPKR: 10500,
      status: "Active",
    },
    {
      id: "MF-84945",
      name: "Usman Raza",
      mobile: "0312-9876543",
      joinedDate: "25 Sep 2026",
      activeLevel: 2,
      matrixType: "S6",
      directCount: 2,
      totalEarnedPKR: 4500,
      status: "Active",
    },
    {
      id: "MF-85012",
      name: "Hamza Malik",
      mobile: "0333-5554433",
      joinedDate: "20 Sep 2026",
      activeLevel: 1,
      matrixType: "S6",
      directCount: 0,
      totalEarnedPKR: 1500,
      status: "Active",
    },
    {
      id: "MF-85100",
      name: "Bilal Shah",
      mobile: "0345-7766554",
      joinedDate: "15 Sep 2026",
      activeLevel: 0,
      matrixType: "None",
      directCount: 0,
      totalEarnedPKR: 0,
      status: "Pending Deposit",
    },
  ];

  // Filter members by search & active level
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevelFilter === "all" ||
      member.activeLevel.toString() === selectedLevelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 gap-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                Network & Direct Downline
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              My Team Directory
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track your direct partners, matrix slot levels, and downline
              commission progress.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-bold bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Team Stats Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Direct Partners
            </p>
            <p className="text-2xl font-mono font-black text-emerald-400">
              {teamStats.directPartners}
            </p>
            <p className="text-[10px] text-slate-500">
              Personally invited members
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Network Size
            </p>
            <p className="text-2xl font-mono font-black text-white">
              {teamStats.totalTeam} Members
            </p>
            <p className="text-[10px] text-emerald-400">
              Includes direct & indirect referrals
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active Members
            </p>
            <p className="text-2xl font-mono font-black text-white">
              {teamStats.activeTeamMembers}
            </p>
            <p className="text-[10px] text-slate-500">Slot activated users</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-1">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Team Turnover
            </p>
            <p className="text-2xl font-mono font-black text-emerald-400">
              Rs. {teamStats.teamTurnoverPKR.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">Total volume generated</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by Member Name or User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">
              Filter Level:
            </span>
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Levels</option>
              <option value="0">Unactivated (Level 0)</option>
              <option value="1">Level 1 (S6)</option>
              <option value="2">Level 2 (S6)</option>
              <option value="3">Level 3 (S3)</option>
            </select>
          </div>
        </div>

        {/* Team Members List Table / Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">
              Direct Downline List
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredMembers.length} Members
            </span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Member Info</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Max Level</th>
                  <th className="py-3 px-4">Direct Partners</th>
                  <th className="py-3 px-4">Total Earned</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-950/50 transition-colors"
                  >
                    {/* Member Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/20 text-xs">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{member.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            ID:{" "}
                            <span className="text-emerald-400">
                              {member.id}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4 text-slate-400 text-[11px]">
                      {member.joinedDate}
                    </td>

                    {/* Max Level Badge */}
                    <td className="py-4 px-4">
                      {member.activeLevel > 0 ? (
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 text-[10px]">
                          Level {member.activeLevel} ({member.matrixType})
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-full border border-slate-700 text-[10px]">
                          Level 0
                        </span>
                      )}
                    </td>

                    {/* Direct Count */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-200">
                      {member.directCount} Members
                    </td>

                    {/* Total Earned */}
                    <td className="py-4 px-4 font-mono font-bold text-emerald-400">
                      Rs. {member.totalEarnedPKR.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${
                          member.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                No team members found matching your query.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
