// app/api/admin/stats/route.js
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Deposit from "@/models/Deposit";
import Withdraw from "@/models/Withdraw";
import SupportTicket from "@/models/SupportTicket";
import connectDb from "@/lib/db";

export async function GET() {
  try {
    await connectDb();

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      unverifiedUsers,
      pendingDeposits,
      approvedDeposits,
      rejectedDeposits,
      pendingWithdraws,
      approvedWithdraws,
      rejectedWithdraws,
      eWalletAgg,
      sWalletAgg,
      totalWithdrawnAgg,
      openTickets,
      depositAmountAgg,
      withdrawAmountAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "suspended" }),
      User.countDocuments({ status: "unverified" }),

      Deposit.countDocuments({ status: "pending" }),
      Deposit.countDocuments({ status: "approved" }),
      Deposit.countDocuments({ status: "rejected" }),

      Withdraw.countDocuments({ status: "pending" }),
      Withdraw.countDocuments({ status: "approved" }),
      Withdraw.countDocuments({ status: "rejected" }),

      User.aggregate([
        { $group: { _id: null, total: { $sum: "$wallet.eWallet" } } },
      ]),
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$wallet.sWallet" } } },
      ]),
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$wallet.totalWithdrawn" } } },
      ]),

      SupportTicket.countDocuments({ status: "open" }),

      Deposit.aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            totalWX: { $sum: "$amountWX" },
            totalPKR: { $sum: "$amountPKR" },
          },
        },
      ]),
      Withdraw.aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            totalWX: { $sum: "$amountWX" },
            totalNetWX: { $sum: "$netWX" },
            totalTax: { $sum: "$taxWX" },
          },
        },
      ]),
    ]);

    return Response.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        unverified: unverifiedUsers,
      },
      deposits: {
        pending: pendingDeposits,
        approved: approvedDeposits,
        rejected: rejectedDeposits,
        totalApprovedWX: depositAmountAgg[0]?.totalWX || 0,
        totalApprovedPKR: depositAmountAgg[0]?.totalPKR || 0,
      },
      withdraws: {
        pending: pendingWithdraws,
        approved: approvedWithdraws,
        rejected: rejectedWithdraws,
        totalRequestedWX: withdrawAmountAgg[0]?.totalWX || 0,
        totalNetWX: withdrawAmountAgg[0]?.totalNetWX || 0,
        totalTaxWX: withdrawAmountAgg[0]?.totalTax || 0,
      },
      wallets: {
        totalEWallet: eWalletAgg[0]?.total || 0,
        totalSWallet: sWalletAgg[0]?.total || 0,
        totalWithdrawn: totalWithdrawnAgg[0]?.total || 0,
      },
      support: {
        open: openTickets,
      },
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
