import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import Withdraw from "@/models/Withdraw";
import User from "@/models/User";
import { WX_RATE, WITHDRAW_RULES } from "@/config/wealnex.config";
import mongoose from "mongoose";

export async function POST(req) {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // FIX: Number() conversion + fallback
  const amountWX = Number(body.amountWX) || 0;
  const method = body.method || "jazzcash";
  const accountTitle = body.accountTitle;
  const accountNumber = body.accountNumber;

  // FIX: Fallback agar WITHDRAW_RULES undefined ho
  const MIN_WX = WITHDRAW_RULES?.minWX ?? 10;
  const TAX_PERCENT = WITHDRAW_RULES?.taxPercent ?? 10;
  const RATE = WX_RATE ?? 100;

  if (!amountWX || amountWX < MIN_WX) {
    return Response.json(
      { error: `Minimum withdraw ${MIN_WX} WX$` },
      { status: 400 },
    );
  }

  if (!accountTitle || !accountNumber) {
    return Response.json(
      { error: "Account details required" },
      { status: 400 },
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(auth._id).session(session);
    if (!user) throw new Error("User not found");

    if (user.wallet.eWallet < amountWX) {
      throw new Error(
        `Insufficient eWallet. Balance: ${user.wallet.eWallet} WX$`,
      );
    }

    // FIXED CALCULATION - NaN kabhi nahi
    const taxWX = Math.floor((amountWX * TAX_PERCENT) / 100);
    const netWX = amountWX - taxWX;
    const amountPKR = netWX * RATE;

    console.log("Withdraw Calc:", { amountWX, taxWX, netWX, amountPKR }); // Debug

    if (isNaN(taxWX) || isNaN(netWX)) {
      throw new Error("Calculation failed - check config");
    }

    // Balance deduct
    user.wallet.eWallet -= amountWX;
    await user.save({ session });

    const wd = await Withdraw.create(
      [
        {
          user: auth._id,
          amountWX,
          taxWX,
          netWX,
          amountPKR,
          method,
          accountTitle,
          accountNumber,
          status: "pending",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return Response.json({
      success: true,
      message: `Withdraw request ${amountWX} WX$ sent. You will receive ${netWX} WX$ (${amountPKR} PKR) after ${TAX_PERCENT}% tax.`,
      withdraw: wd[0],
    });
  } catch (e) {
    await session.abortTransaction();
    console.error("Withdraw Error:", e);
    return Response.json({ error: e.message }, { status: 400 });
  } finally {
    session.endSession();
  }
}
