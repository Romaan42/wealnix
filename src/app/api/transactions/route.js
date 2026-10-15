import checkUserLogin from "@/lib/checkUserLogin";
import connectDb from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  try {
    await connectDb();
    const user = await checkUserLogin();
    if (!user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "All";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const query = { userId: user._id };

    // TABS mapping
    if (type !== "All") {
      if (type === "Team Commission") query.type = "Team";
      else query.type = type; // Direct, Binary, ROI, Withdraw
    }

    if (search) {
      query.$or = [
        { fromUserName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Transaction.countDocuments(query);
    const totalEarned = await Transaction.aggregate([
      { $match: { userId: user._id, amount: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Frontend ke liye format karo
    const formatted = transactions.map((tx) => ({
      _id: tx._id,
      type: tx.type,
      amount: tx.amount,
      fromUser: tx.fromUserName || "System",
      fromId: tx.fromUserIdCode || "WEALNIX",
      description: tx.description,
      date: new Date(tx.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: tx.status,
      level: tx.level,
      splitInfo: tx.splitInfo,
    }));

    return Response.json({
      success: true,
      transactions: formatted,
      pagination: { page, totalPages: Math.ceil(total / limit), total },
      totalEarned: totalEarned[0]?.total || 0,
    });
  } catch (e) {
    console.error("Transactions API Error:", e);
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}
