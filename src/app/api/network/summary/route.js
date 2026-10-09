import User from "@/models/User";
import checkUserLogin from "@/lib/checkUserLogin";
import connectDb from "@/lib/db";
import { COMMISSION_TABLE, WX_RATE } from "@/config/wealnex.config";

export async function GET() {
  try {
    await connectDb();
    const authUser = await checkUserLogin();
    if (!authUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const currentUser = await User.findById(authUser._id).lean();
    if (!currentUser)
      return Response.json({ error: "User not found" }, { status: 404 });

    let totalTeam = 0;
    let totalCommissionEarned = 0;
    let totalTeamSalesWX = 0;
    const levelsData = [];
    let currentLevelIds = [currentUser._id];

    // 5 Level Loop - PDF Page 5 logic
    for (let i = 0; i < 5; i++) {
      const levelNum = i + 1;
      const users = await User.find({ sponsor: { $in: currentLevelIds } })
        .select(
          "userName name currentBundle createdAt status volumePoints rank",
        )
        .lean();

      let levelCommission = 0;
      let levelSalesWX = 0;

      for (const u of users) {
        const price = u.currentBundle || 0;
        levelSalesWX += price;
        // FIX: Commission Table se exact WX$ lo, % calculate nahi
        const table = COMMISSION_TABLE[price];
        if (table) {
          const commissionForThisLevel = table[`L${levelNum}`] || 0;
          levelCommission += commissionForThisLevel;
        }
      }

      totalTeam += users.length;
      totalCommissionEarned += levelCommission;
      totalTeamSalesWX += levelSalesWX;

      levelsData.push({
        level: levelNum,
        count: users.length,
        commission: levelCommission,
        commissionPKR: levelCommission * WX_RATE,
        salesWX: levelSalesWX,
        percent:
          levelNum === 1 ? "30-40% (Bundle wise)" : `${[12, 7, 4, 2][i - 1]}%`,
        members: users.slice(0, 100).map((u) => ({
          userName: u.userName,
          name: u.name || u.userName,
          bundle: u.currentBundle,
          bundleWX: u.currentBundle ? `${u.currentBundle} WX$` : "Free",
          bundlePKR: (u.currentBundle || 0) * WX_RATE,
          commissionEarnedFromHim:
            COMMISSION_TABLE[u.currentBundle || 0]?.[`L${levelNum}`] || 0,
          vp: u.volumePoints,
          rank: u.rank,
          joined: u.createdAt,
          status: u.status,
        })),
      });

      currentLevelIds = users.map((u) => u._id);
      if (currentLevelIds.length === 0) {
        // Baqi levels empty fill karo
        for (let j = i + 1; j < 5; j++) {
          levelsData.push({
            level: j + 1,
            count: 0,
            commission: 0,
            commissionPKR: 0,
            salesWX: 0,
            percent: `${[12, 7, 4, 2][j - 1]}%`,
            members: [],
          });
        }
        break;
      }
    }

    // Upline chain - direct sponsor pehle
    const upline = [];
    if (currentUser.ancestors?.length > 0) {
      const ancestorsUsers = await User.find({
        _id: { $in: currentUser.ancestors },
      })
        .select("userName name currentBundle rank volumePoints")
        .lean();
      // ancestors array already L1->L5 order mein hai (register API se)
      const map = new Map(ancestorsUsers.map((u) => [u._id.toString(), u]));
      for (const id of currentUser.ancestors) {
        const u = map.get(id.toString());
        if (u) upline.push(u);
      }
    }

    return Response.json({
      success: true,
      totalTeam,
      direct: levelsData[0]?.count || 0,
      levels: levelsData,
      totalCommission: totalCommissionEarned,
      totalCommissionPKR: totalCommissionEarned * WX_RATE,
      totalTeamSalesWX,
      totalTeamSalesPKR: totalTeamSalesWX * WX_RATE,
      // Real wallet - DB se, calculated nahi
      wallet: {
        eWallet: currentUser.wallet?.eWallet || 0,
        sWallet: currentUser.wallet?.sWallet || 0,
        eWalletPKR: (currentUser.wallet?.eWallet || 0) * WX_RATE,
        sWalletPKR: (currentUser.wallet?.sWallet || 0) * WX_RATE,
      },
      upline,
      rank: currentUser.rank,
      volumePoints: currentUser.volumePoints,
      stats: currentUser.stats,
    });
  } catch (error) {
    console.error("Network Summary Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
