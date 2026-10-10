import connectDb from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDb();
    const { id } = await params;
    const body = await req.json();
    const { action, adminNote } = body; // action: 'approved' | 'rejected'

    if (!["approved", "rejected"].includes(action)) {
      return Response.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    const deposit = await Deposit.findById(id).session(session);
    if (!deposit) {
      await session.abortTransaction();
      return Response.json(
        { success: false, error: "Deposit not found" },
        { status: 404 },
      );
    }

    if (deposit.status !== "pending") {
      await session.abortTransaction();
      return Response.json(
        { success: false, error: `Already ${deposit.status}` },
        { status: 400 },
      );
    }

    // If Approved -> Credit eWallet
    if (action === "approved") {
      await User.findByIdAndUpdate(
        deposit.user,
        { $inc: { "wallet.eWallet": deposit.amountWX } },
        { session },
      );
    }

    deposit.status = action;
    deposit.adminNote = adminNote || "";
    // deposit.approvedBy = adminId // jab admin auth lagega
    await deposit.save({ session });

    await session.commitTransaction();

    return Response.json({
      success: true,
      message: `Deposit ${action} successfully`,
      deposit,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("PUT Deposit Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
