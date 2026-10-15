import connectDb from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

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
      if (!buyer) throw new Error(`Buyer not found for ID ${deposit.user}`);

      const bundleWX = deposit.amountWX;
      const bundleVP = bundleWX / 10;
      const commissions = COMMISSION_TABLE[bundleWX];
      if (!commissions) throw new Error(`Invalid bundle WX$ ${bundleWX}`);

      console.log(
        `[APPROVE] Buyer: ${buyer.name || buyer.userName} | Bundle: ${bundleWX} | Ancestors: ${buyer.ancestors?.length || 0}`,
      );

      let totalDistributed = 0;

      // Ancestors loop - 5 levels tak
      for (let i = 0; i < (buyer.ancestors?.length || 0); i++) {
        const level = i + 1;
        if (level > 5) break;

        const commissionWX = commissions[`L${level}`];
        if (!commissionWX) continue;

        // Ancestor ID safely extract karna (chahe string ho ya populated object)
        const ancestorItem = buyer.ancestors[i];
        const uplineId = ancestorItem?._id ? ancestorItem._id : ancestorItem;

        if (!uplineId) continue;

        // 🟢 UPLINE CHECK: Schema ke mutabiq check karo ke upline ne plan select kiya hai ya nahi (currentBundle > 0)
        const uplineUserCheck = await User.findById(uplineId);
        if (
          !uplineUserCheck ||
          uplineUserCheck.currentBundle <= 0 ||
          uplineUserCheck.status !== "active"
        ) {
          console.log(
            `[SKIP] L${level} Upline ID ${uplineId} has not selected a plan (currentBundle: ${uplineUserCheck?.currentBundle}) or is not active. Commission skipped.`,
          );
          continue;
        }

        totalDistributed += commissionWX;
        const eWalletPart = commissionWX * 0.8;
        const sWalletPart = commissionWX * 0.2;
        const vpCredit = level === 1 ? bundleVP : bundleVP * 0.5;

        // Buyer ki pehli activation check (agar buyer ka currentBundle pehle 0 tha)
        const isFirstActivation = (buyer.currentBundle || 0) === 0;

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

        // 1. Wallet Update
        const updatedUpline = await User.findByIdAndUpdate(
          uplineId,
          { $inc: incObj },
          { new: true },
        );

        if (!updatedUpline) {
          console.warn(
            `[L${level}] Upline not found during update: ${uplineId}`,
          );
          continue;
        }

        // 2. Rank Update
        const newRank = getRankByVP(updatedUpline.volumePoints);
        if (newRank !== updatedUpline.rank) {
          await User.findByIdAndUpdate(updatedUpline._id, { rank: newRank });
        }

        // 3. TRANSACTION CREATE
        try {
          const tx = await Transaction.create({
            userId: updatedUpline._id,
            type: level === 1 ? "Direct" : "Team",
            amount: commissionWX,
            wxAmount: commissionWX,
            fromUser: buyer._id,
            fromUserName: buyer.name || buyer.userName || "User",
            fromUserIdCode:
              buyer.referralCode ||
              buyer._id.toString().slice(-6).toUpperCase(),
            relatedDeposit: deposit._id,
            level: level,
            description: `L${level} commission from ${buyer.name || buyer.userName || "User"} - Bundle WX$${bundleWX}`,
            status: "completed",
            splitInfo: {
              eWallet: eWalletPart,
              sWallet: sWalletPart,
            },
          });
          console.log(
            `[TX SUCCESS] L${level} -> ${updatedUpline.name || updatedUpline.userName} WX$${commissionWX} | ID: ${tx._id}`,
          );
        } catch (txErr) {
          console.error(
            `[TX FAILED] L${level} for user ${updatedUpline._id}:`,
            txErr.message,
          );
        }
      }

      console.log(
        `[RETENTION] Company keeps: WX$${bundleWX - totalDistributed}`,
      );

      // 4. Buyer Activation & Bundle Update
      const newVP = (buyer.volumePoints || 0) + bundleVP;
      const newRank = getRankByVP(newVP);
      await User.findByIdAndUpdate(buyer._id, {
        $inc: { volumePoints: bundleVP },
        $set: {
          currentBundle: Math.max(buyer.currentBundle || 0, bundleWX),
          rank: newRank,
          status: "active",
        },
      });
    }

    deposit.status = action;
    deposit.adminNote = adminNote || "";
    await deposit.save();

    return Response.json({
      success: true,
      message: `Deposit ${action}. Commissions distributed & logged.`,
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
