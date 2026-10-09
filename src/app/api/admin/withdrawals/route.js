// app/api/admin/withdrawals/route.js
import connectDb from "@/lib/db";
import Withdraw from "@/models/Withdraw";

export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";

    const filter = status === "all" ? {} : { status };

    const withdrawals = await Withdraw.find(filter)
      .populate("user", "userName name email number wallet currentBundle rank")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ success: true, withdrawals });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
