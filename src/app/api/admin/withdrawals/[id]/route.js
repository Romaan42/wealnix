// app/api/admin/withdrawals/[id]/route.js
import Withdraw from "@/models/Withdraw";
import User from "@/models/User";
import mongoose from "mongoose";
import connectDb from "@/lib/db";

export async function PUT(req, { params }) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDb();
    const { id } = await params;
    const { action, adminTrxId, adminNote } = await req.json(); // action: approved | rejected

    if (!["approved", "rejected"].includes(action)) {
      return Response.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    const withdraw = await Withdraw.findById(id).session(session);
    if (!withdraw) {
      await session.abortTransaction();
      return Response.json(
        { success: false, error: "Withdrawal not found" },
        { status: 404 },
      );
    }

    if (withdraw.status !== "pending") {
      await session.abortTransaction();
      return Response.json(
        { success: false, error: `Already ${withdraw.status}` },
        { status: 400 },
      );
    }

    if (action === "approved") {
      if (!adminTrxId) {
        await session.abortTransaction();
        return Response.json(
          {
            success: false,
            error: "Admin Transaction ID required for approval",
          },
          { status: 400 },
        );
      }
      // Withdraw request pe eWallet pehle se debit hua hota hai user side se
      // Yahan sirf totalWithdrawn increase karenge
      await User.findByIdAndUpdate(
        withdraw.user,
        { $inc: { "wallet.totalWithdrawn": withdraw.netWX } },
        { session },
      );
      withdraw.status = "approved";
      withdraw.adminTrxId = adminTrxId;
      withdraw.adminNote = adminNote || "";
    }

    if (action === "rejected") {
      // Refund logic - eWallet me wapis
      await User.findByIdAndUpdate(
        withdraw.user,
        { $inc: { "wallet.eWallet": withdraw.amountWX } },
        { session },
      );
      withdraw.status = "rejected";
      withdraw.adminNote = adminNote || "Rejected by admin";
    }

    await withdraw.save({ session });
    await session.commitTransaction();

    return Response.json({
      success: true,
      message: `Withdrawal ${action} successfully`,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
