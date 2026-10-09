import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import {
  BUNDLES,
  COMMISSION_TABLE,
  WALLET_SPLIT,
  RANKS,
  WX_RATE,
} from "@/config/wealnex.config";
import connectDb from "@/lib/db";

function getRankByVP(vp) {
  // Highest to lowest check
  const sorted = [...RANKS].sort((a, b) => b.vp - a.vp);
  for (const r of sorted) {
    if (vp >= r.vp) return r.name;
  }
  return "Beginner";
}

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

  const bundle = Object.values(BUNDLES).find(
    (b) => b.priceWX === bundlePriceWX,
  );
  if (!bundle)
    return Response.json({ error: "Invalid Bundle" }, { status: 400 });

  if (!userName || !email || !password) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Duplicate check
    const exists = await User.findOne({
      $or: [
        { userName: userName.toLowerCase() },
        { email: email.toLowerCase() },
        { number },
      ],
    }).session(session);
    if (exists) throw new Error("UserName / Email / Number already exists");

    let sponsor = null;
    let ancestors = [];
    if (sponsorUserName) {
      sponsor = await User.findOne({
        userName: sponsorUserName.toLowerCase(),
      }).session(session);
      if (!sponsor) throw new Error("Invalid Sponsor Username");
      ancestors = [sponsor._id, ...sponsor.ancestors].slice(0, 5);
    }

    const hashed = await bcrypt.hash(password, 10);

    const [newUser] = await User.create(
      [
        {
          name,
          userName: userName.toLowerCase(),
          email: email.toLowerCase(),
          number,
          password: hashed,
          sponsor: sponsor?._id || null,
          ancestors,
          currentBundle: bundlePriceWX,
          volumePoints: 0,
          rank: "Beginner",
          wallet: { eWallet: 0, sWallet: 0, totalWithdrawn: 0 },
          stats: { directTeam: 0, totalTeam: 0, totalTeamSalesWX: 0 },
        },
      ],
      { session },
    );

    // COMMISSION DISTRIBUTION - PDF Page 2 & 5
    const commissions = COMMISSION_TABLE[bundlePriceWX]; // {L1:35, L2:12...}
    let companyRetentionWX = bundlePriceWX;

    for (let i = 0; i < ancestors.length; i++) {
      const level = i + 1;
      const commissionWX = commissions[`L${level}`];
      if (!commissionWX) continue;

      companyRetentionWX -= commissionWX;

      const eWX = commissionWX * WALLET_SPLIT.E_WALLET; // 80%
      const sWX = commissionWX * WALLET_SPLIT.S_WALLET; // 20%

      // VP Engine: L1 = 100% VP, L2-L5 = 50% VP - PDF Page 1
      const vpCredit = level === 1 ? bundle.vp : bundle.vp * 0.5;

      const incObj = {
        "wallet.eWallet": eWX,
        "wallet.sWallet": sWX,
        volumePoints: vpCredit,
        "stats.totalTeam": 1,
        "stats.totalTeamSalesWX": bundlePriceWX,
      };
      if (level === 1) incObj["stats.directTeam"] = 1;

      const updatedUpline = await User.findByIdAndUpdate(
        ancestors[i],
        { $inc: incObj },
        { session, new: true },
      );

      // Rank auto-update
      if (updatedUpline) {
        const newRank = getRankByVP(updatedUpline.volumePoints);
        if (newRank !== updatedUpline.rank) {
          await User.findByIdAndUpdate(
            ancestors[i],
            { rank: newRank },
            { session },
          );
        }
      }
    }

    // TODO: Company Ledger mein companyRetentionWX save karo
    // await CompanyLedger.create([{ saleWX: bundlePriceWX, retentionWX: companyRetentionWX, buyer: newUser._id }], { session })

    await session.commitTransaction();

    // Password hata ke response
    const safeUser = newUser.toObject();
    delete safeUser.password;

    return Response.json({
      success: true,
      user: safeUser,
      bundle: bundle.name,
      companyRetentionWX,
      companyRetentionPKR: companyRetentionWX * WX_RATE,
      message: `Registration successful with ${bundle.name} Bundle`,
    });
  } catch (e) {
    await session.abortTransaction();
    return Response.json({ error: e.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
