import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDb from "@/lib/db";

export async function POST(req) {
  await connectDb();
  const { name, userName, sponsorUserName, email, number, password } =
    await req.json();

  if (!userName || !email || !password || !number) {
    return Response.json(
      { error: "Missing fields: userName, email, number, password required" },
      { status: 400 },
    );
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
          currentBundle: 0, // No bundle
          volumePoints: 0,
          rank: "Beginner",
          wallet: { eWallet: 0, sWallet: 0, totalWithdrawn: 0 },
          stats: { directTeam: 0, totalTeam: 0, totalTeamSalesWX: 0 },
        },
      ],
      { session },
    );

    // Sirf team counts update karo, koi commission / bundle nahi
    if (sponsor) {
      for (let i = 0; i < ancestors.length; i++) {
        const level = i + 1;
        const incObj = {
          "stats.totalTeam": 1,
        };
        if (level === 1) incObj["stats.directTeam"] = 1;

        await User.findByIdAndUpdate(
          ancestors[i],
          { $inc: incObj },
          { session },
        );
      }
    }

    await session.commitTransaction();

    const safeUser = newUser.toObject();
    delete safeUser.password;

    return Response.json({
      success: true,
      user: safeUser,
      message: "Registration successful",
    });
  } catch (e) {
    await session.abortTransaction();
    return Response.json({ error: e.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}
