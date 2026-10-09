import connectDb from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";

export async function GET(req) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "open"; // open, replied, closed, all
    const category = searchParams.get("category") || "all";

    const filter = {};
    if (status !== "all") filter.status = status;
    if (category !== "all") filter.category = category;

    const tickets = await SupportTicket.find(filter)
      .populate("user", "userName name email number currentBundle rank")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({ success: true, tickets });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
