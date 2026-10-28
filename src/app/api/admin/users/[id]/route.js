import connectDb from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import checkAdminLogin from "@/lib/checkAdminLogin";

export async function PUT(req, { params }) {
  try {
    const isAdmin = await checkAdminLogin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDb();
    const { id } = await params;
    const body = await req.json();
    const { action, value, reason } = body;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    let message = "";
    let updatedUser = null;

    switch (action) {
      case "status":
        if (!["active", "suspended", "unverified"].includes(value)) {
          return NextResponse.json(
            { success: false, error: "Invalid status" },
            { status: 400 },
          );
        }
        user.status = value;
        message = `User status changed to ${value}`;
        break;

      case "wallet":
        const { type, amount, operation } = value;
        if (!["eWallet", "sWallet"].includes(type)) {
          return NextResponse.json(
            { success: false, error: "Invalid wallet type" },
            { status: 400 },
          );
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
          return NextResponse.json(
            { success: false, error: "Invalid amount" },
            { status: 400 },
          );
        }
        if (operation === "add") {
          user.wallet[type] += numAmount;
        } else {
          if (user.wallet[type] < numAmount) {
            return NextResponse.json(
              { success: false, error: `Insufficient ${type} balance` },
              { status: 400 },
            );
          }
          user.wallet[type] -= numAmount;
        }
        message = `${operation === "add" ? "Added" : "Deducted"} WX$ ${numAmount} to ${type}`;
        break;

      case "rank":
        user.rank = value;
        message = `Rank updated to ${value}`;
        break;

      case "bundle":
        user.currentBundle = parseFloat(value);
        message = `Bundle updated to ${value}`;
        break;

      case "kyc":
        // value = "verified" | "rejected" | { status, reason }
        if (typeof value === "string") {
          if (
            !["verified", "rejected", "pending", "submitted"].includes(value)
          ) {
            return NextResponse.json(
              { success: false, error: "Invalid KYC status" },
              { status: 400 },
            );
          }
          user.kycStatus = value;
          if (value === "verified") user.kycReason = "";
          if (value === "rejected" && reason) user.kycReason = reason;
        } else if (typeof value === "object") {
          // { status: "rejected", reason: "Blurry image" }
          user.kycStatus = value.status;
          user.kycReason = value.reason || "";
        }
        message = `KYC ${user.kycStatus}`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    await user.save();

    // Return updated user without password for frontend
    updatedUser = await User.findById(id)
      .select("-password")
      .populate("sponsor", "userName name")
      .lean();

    return NextResponse.json({
      success: true,
      message,
      user: updatedUser,
      updatedUser: updatedUser, // dono key bhej di taake tumhara purana code bhi chale
    });
  } catch (error) {
    console.log("PUT /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
