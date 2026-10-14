import connectDb from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";

const COMMISSION_TABLE = {
  20: { L1: 6, L2: 2.4, L3: 1.4, L4: 0.8, L5: 0.4 },
  50: { L1: 17.5, L2: 6, L3: 3.5, L4: 2, L5: 1 },
  100: { L1: 35, L2: 12, L3: 7, L4: 4, L5: 2 },
  150: { L1: 57, L2: 18, L3: 10.5, L4: 6, L5: 3 },
  200: { L1: 80, L2: 24, L3: 14, L4: 8, L5: 4 },
};

const RANKS = [
  { name: "Beginner", vp: 0 },
  { name: "Bronze", vp: 100 },
  { name: "Silver", vp: 300 },
  { name: "Gold", vp: 800 },
  { name: "Platinum", vp: 2500 },
  { name: "Diamond", vp: 8000 },
  { name: "Crown Director", vp: 20000 },
];

function getRankByVP(vp) {
  const sorted = [...RANKS].sort((a, b) => b.vp - a.vp);
  for (const r of sorted) if (vp >= r.vp) return r.name;
  return "Beginner";
}

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { id } = await params;
    const { action, adminNote } = await req.json();

    if (!["approved", "rejected"].includes(action)) {
      return Response.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    const deposit = await Deposit.findById(id);
    if (!deposit) {
      return Response.json(
        { success: false, error: "Deposit not found" },
        { status: 404 },
      );
    }

    if (deposit.status !== "pending") {
      return Response.json(
        { success: false, error: `Already ${deposit.status}` },
        { status: 400 },
      );
    }

    if (action === "approved") {
      const buyer = await User.findById(deposit.user);
      if (!buyer) throw new Error("Buyer user not found");

      const bundleWX = deposit.amountWX;
      const bundleVP = bundleWX / 10;
      const commissions = COMMISSION_TABLE[bundleWX];
      if (!commissions) throw new Error(`Invalid bundle WX$ ${bundleWX}`);

      // FIX 1: BLUEPRINT 80/20 WALLET SPLIT + COMPANY RETENTION
      let totalDistributed = 0;

      for (let i = 0; i < buyer.ancestors.length; i++) {
        const level = i + 1;
        if (level > 5) break;
        const commissionWX = commissions[`L${level}`];
        if (!commissionWX) continue;

        totalDistributed += commissionWX;
        const eWalletPart = commissionWX * 0.8; // 80% withdrawable
        const sWalletPart = commissionWX * 0.2; // 20% locked

        const vpCredit = level === 1 ? bundleVP : bundleVP * 0.5;

        // FIX 2: Direct team sirf pehli baar count ho
        const isFirstActivation = !buyer.isActive;

        const incObj = {
          "wallet.eWallet": eWalletPart,
          "wallet.sWallet": sWalletPart,
          volumePoints: vpCredit,
          "stats.totalTeamSalesWX": bundleWX,
        };
        if (isFirstActivation) {
          if (level === 1) incObj["stats.directTeam"] = 1;
          incObj["stats.totalTeam"] = 1;
        }

        const updatedUpline = await User.findByIdAndUpdate(
          buyer.ancestors[i],
          { $inc: incObj },
          { new: true },
        );

        if (updatedUpline) {
          const newRank = getRankByVP(updatedUpline.volumePoints);
          if (newRank !== updatedUpline.rank) {
            await User.findByIdAndUpdate(buyer.ancestors[i], { rank: newRank });
          }
        }
      }

      const companyRetention = bundleWX - totalDistributed;
      console.log(
        `Company Retention for deposit ${deposit._id}: WX$${companyRetention}`,
      );

      // BUYER: PAISA NAHI DENA, SIRF BUNDLE + VP
      const newVP = (buyer.volumePoints || 0) + bundleVP;
      const newRank = getRankByVP(newVP);

      await User.findByIdAndUpdate(buyer._id, {
        $inc: { volumePoints: bundleVP },
        $set: {
          currentBundle: Math.max(buyer.currentBundle || 0, bundleWX),
          rank: newRank,
          isActive: true,
        },
      });
    }

    deposit.status = action;
    deposit.adminNote = adminNote || "";
    await deposit.save();

    return Response.json({
      success: true,
      message: `Deposit ${action} - Blueprint compliant (80/20 split)`,
      deposit,
    });
  } catch (error) {
    console.error("PUT Deposit Error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
