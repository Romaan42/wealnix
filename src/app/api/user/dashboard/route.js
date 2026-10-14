import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import Deposit from "@/models/Deposit";
import Withdraw from "@/models/Withdraw";
import checkUserLogin from "@/lib/checkUserLogin";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();
    const session = await checkUserLogin();
    if (!session?.userId) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // FIX: String ID ko ObjectId me convert
    const userId = new mongoose.Types.ObjectId(session.userId);

    const [user, depositsAgg, withdrawsAgg, recentDeposits, recentWithdraws] =
      await Promise.all([
        User.findById(userId).lean(),
        Deposit.aggregate([
          { $match: { user: userId, status: "approved" } },
          {
            $group: {
              _id: null,
              totalWX: { $sum: "$amountWX" },
              totalPKR: { $sum: "$amountPKR" },
            },
          },
        ]),
        Withdraw.aggregate([
          { $match: { user: userId, status: "approved" } },
          {
            $group: {
              _id: null,
              totalWX: { $sum: "$amountWX" },
              totalNet: { $sum: "$netWX" },
            },
          },
        ]),
        Deposit.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean(),
        Withdraw.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    const totalDepositsWX = depositsAgg[0]?.totalWX || 0;
    const totalWithdrawsWX = withdrawsAgg[0]?.totalWX || 0;
    const totalNetWithdrawsWX = withdrawsAgg[0]?.totalNet || 0;

    const monthlyData = await Deposit.aggregate([
      {
        $match: {
          user: userId,
          status: "approved",
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      },
      {
        $group: { _id: { $month: "$createdAt" }, total: { $sum: "$amountWX" } },
      },
      { $sort: { _id: 1 } },
    ]);

    const activities = [
      ...recentDeposits.map((d) => ({
        date: new Date(d.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        description: `Deposit ${d.method} (${d.status})`,
        amount: d.amountWX,
        type: "deposit",
        status: d.status,
      })),
      ...recentWithdraws.map((w) => ({
        date: new Date(w.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        description: `Withdraw to ${w.method}`,
        amount: -w.amountWX,
        type: "withdraw",
        status: w.status,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      wallet: {
        eWallet: user?.wallet?.eWallet || 0,
        sWallet: user?.wallet?.sWallet || 0,
        totalWithdrawn: user?.wallet?.totalWithdrawn || totalNetWithdrawsWX,
        total: (user?.wallet?.eWallet || 0) + (user?.wallet?.sWallet || 0),
      },
      stats: {
        directTeam: user?.stats?.directTeam || 0,
        totalTeam: user?.stats?.totalTeam || 0,
        totalTeamSalesWX: user?.stats?.totalTeamSalesWX || 0,
        totalDepositsWX,
        totalWithdrawsWX,
        totalEarningsWX: totalDepositsWX,
      },
      membership: {
        currentBundle: user?.currentBundle || 0,
        // FIX: Agar tier/rank nahi hai to null bhejo
        tier: user?.rank ? user.rank : null,
        volumePoints: user?.volumePoints || 0,
      },
      kyc: { status: user?.status || "active" },
      user: {
        name: user?.name || user?.userName,
        email: user?.email,
        userName: user?.userName,
      },
      recentActivities: activities,
      financialOverview:
        monthlyData.length > 0
          ? monthlyData.map((m) => ({
              month: new Date(0, m._id - 1).toLocaleString("en", {
                month: "short",
              }),
              income: m.total,
              expense: Math.floor(m.total * 0.3),
            }))
          : [
              { month: "Jan", income: 0, expense: 0 },
              { month: "Feb", income: 0, expense: 0 },
              { month: "Mar", income: 0, expense: 0 },
              {
                month: "Apr",
                income: totalDepositsWX,
                expense: totalWithdrawsWX,
              },
            ],
    });
  } catch (e) {
    console.error("Dashboard API Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}
