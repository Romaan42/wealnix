// app/api/register/route.js
import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  BUNDLES,
  COMMISSION_TABLE,
  WALLET_SPLIT,
  WX_RATE,
} from "@/config/wealnex.config";
import connectDb from "@/lib/db";

export async function POST(req) {
  await connectDb();
  const {
    name,
    userName,
    sponsorUserName,
    email,
    number,
    password,
    bundlePriceWX,
  } = await req.json();
  // bundlePriceWX = 20, 50, 100, 150, 200

  const bundle = Object.values(BUNDLES).find(
    (b) => b.priceWX === bundlePriceWX,
  );
  if (!bundle)
    return Response.json({ error: "Invalid Bundle" }, { status: 400 });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const sponsor = sponsorUserName
      ? await User.findOne({ userName: sponsorUserName.toLowerCase() })
      : null;
    const ancestors = sponsor
      ? [sponsor._id, ...sponsor.ancestors].slice(0, 5)
      : [];

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create(
      [
        {
          name,
          userName: userName.toLowerCase(),
          email,
          number,
          password: hashed,
          sponsor: sponsor?._id || null,
          ancestors,
          currentBundle: bundlePriceWX,
          volumePoints: 0,
        },
      ],
      { session },
    );

    // COMMISSION DISTRIBUTION - PDF Page 5 logic
    const commissions = COMMISSION_TABLE[bundlePriceWX]; // e.g., Gold: {L1:35, L2:12...}
    let companyRetentionWX = bundlePriceWX; // Start 100%

    for (let i = 0; i < ancestors.length; i++) {
      const level = i + 1;
      const commissionWX = commissions[`L${level}`];
      if (!commissionWX) continue;

      companyRetentionWX -= commissionWX;

      const eWX = commissionWX * WALLET_SPLIT.E_WALLET;
      const sWX = commissionWX * WALLET_SPLIT.S_WALLET;

      await User.findByIdAndUpdate(
        ancestors[i],
        {
          $inc: {
            "wallet.eWallet": eWX,
            "wallet.sWallet": sWX,
            "stats.totalTeam": 1,
            "stats.totalTeamSalesWX": bundlePriceWX,
            ...(level === 1 && { "stats.directTeam": 1 }),
          },
        },
        { session },
      );

      // VP Engine: L1 ko 100% VP, L2-L5 ko 50% VP (PDF Page 1)
      const vpCredit = level === 1 ? bundle.vp : bundle.vp * 0.5;
      await User.findByIdAndUpdate(
        ancestors[i],
        { $inc: { volumePoints: vpCredit } },
        { session },
      );
    }

    // Direct user ko bhi VP? Agar chahiye toh: new user ko 0, sponsor ko full
    console.log(
      `Company Retention for this sale: ${companyRetentionWX} WX$ (${companyRetentionWX * WX_RATE} PKR)`,
    );

    await session.commitTransaction();
    return Response.json({
      success: true,
      user: newUser[0],
      companyRetentionWX,
      pkrValue: bundle.pricePKR,
    });
  } catch (e) {
    await session.abortTransaction();
    return Response.json({ error: e.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
