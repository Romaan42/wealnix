import User from "@/models/User";
import checkUserLogin from "@/lib/checkUserLogin";
import connectDb from "@/lib/db";
import { WX_RATE } from "@/config/wealnex.config";

export async function GET(req) {
  try {
    await connectDb();
    const auth = await checkUserLogin();
    if (!auth) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const search = (searchParams.get("search") || "").trim();
    const limit = 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(auth._id)
      .select("userName stats volumePoints rank")
      .lean();

    if (!currentUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // FIX: Search query sahi tariqe se - PDF ke mutabiq direct referrals only
    const baseQuery = { sponsor: auth._id };
    let finalQuery = baseQuery;

    if (search) {
      finalQuery = {
        $and: [
          baseQuery,
          {
            $or: [
              { userName: { $regex: search, $options: "i" } },
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
    }

    const [referrals, total, activeCount] = await Promise.all([
      User.find(finalQuery)
        .select(
          "userName name email currentBundle status createdAt volumePoints rank",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(finalQuery),
      User.countDocuments({ ...finalQuery, status: "active" }),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || "https://wealnex.com"}/register?ref=${currentUser.userName}`;

    return Response.json({
      success: true,
      user: {
        userName: currentUser.userName,
        rank: currentUser.rank,
        volumePoints: currentUser.volumePoints,
        stats: {
          directTeam: total, // Is page pe sirf direct dikhane hain
          totalTeam: currentUser.stats?.totalTeam || 0, // Poori 5 level team
          referralLink,
          active: activeCount,
          inactive: total - activeCount,
        },
      },
      referrals: referrals.map((r) => ({
        name: r.name,
        userName: r.userName,
        email: r.email,
        bundle: r.currentBundle,
        bundleName: r.currentBundle ? `${r.currentBundle} WX$` : "Free",
        investment: r.currentBundle,
        investmentPKR: (r.currentBundle || 0) * WX_RATE,
        status: r.status,
        rank: r.rank,
        vp: r.volumePoints,
        joined: r.createdAt,
      })),
      pagination: {
        page,
        totalPages,
        total,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Referrals List Error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
