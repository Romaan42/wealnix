// app/api/admin/deposits/route.js
import dbConnect from "@/lib/db";
import Deposit from "@/models/Deposit";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending"; // pending, approved, rejected, all

    const filter = status === "all" ? {} : { status };

    const deposits = await Deposit.find(filter)
      .populate("user", "userName name email number wallet")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ success: true, deposits });
  } catch (error) {
    console.error("GET Deposits Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
