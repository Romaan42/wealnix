import connectDb from "@/lib/db";
import User from "@/models/User";
import Deposit from "@/models/Deposit";
import Withdraw from "@/models/Withdraw";
import SupportTicket from "@/models/SupportTicket";

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
      // Users Counts
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      User.countDocuments({ status: "suspended" }),
      User.countDocuments({ status: "unverified" }),

      // Deposit Counts
      Deposit.countDocuments({ status: "pending" }),
      Deposit.countDocuments({ status: "approved" }),
      Deposit.countDocuments({ status: "rejected" }),

      // Withdraw Counts
      Withdraw.countDocuments({ status: "pending" }),
      Withdraw.countDocuments({ status: "approved" }),
      Withdraw.countDocuments({ status: "rejected" }),

      // User Wallet Summaries
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$wallet.eWallet" } } },
      ]),
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$wallet.sWallet" } } },
      ]),
      User.aggregate([
        { $group: { _id: null, total: { $sum: "$wallet.totalWithdrawn" } } },
      ]),

      // Support Tickets
      SupportTicket.countDocuments({ status: "open" }),

      // Approved Deposits Aggregation
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

      // Approved Withdrawals Aggregation
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

    // Extraction with Fallbacks
    const totalApprovedWX = depositAmountAgg[0]?.totalWX || 0;
    const totalApprovedPKR = depositAmountAgg[0]?.totalPKR || 0;

    const totalRequestedWX = withdrawAmountAgg[0]?.totalWX || 0;
    const totalNetWX = withdrawAmountAgg[0]?.totalNetWX || 0;
    const totalTaxWX = withdrawAmountAgg[0]?.totalTax || 0;

    // Company Net Balance (Total Deposited - Total Paid Out)
    const companyNetBalanceWX = totalApprovedWX - totalNetWX;
    const companyNetBalancePKR = companyNetBalanceWX * 100;

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
        totalApprovedWX,
        totalApprovedPKR,
      },
      withdraws: {
        pending: pendingWithdraws,
        approved: approvedWithdraws,
        rejected: rejectedWithdraws,
        totalRequestedWX,
        totalNetWX,
        totalTaxWX,
      },
      wallets: {
        totalEWallet: eWalletAgg[0]?.total || 0,
        totalSWallet: sWalletAgg[0]?.total || 0,
        totalWithdrawn: totalWithdrawnAgg[0]?.total || 0,
      },
      companyProfit: {
        taxRevenueWX: totalTaxWX,
        taxRevenuePKR: totalTaxWX * 100,
        netBalanceWX: companyNetBalanceWX,
        netBalancePKR: companyNetBalancePKR,
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
