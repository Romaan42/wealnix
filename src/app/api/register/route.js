import User from "@/models/User";
import bcrypt from "bcryptjs";
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

  try {
    // 1. Duplicate check
    const exists = await User.findOne({
      $or: [
        { userName: userName.toLowerCase() },
        { email: email.toLowerCase() },
        { number },
      ],
    });
    if (exists) throw new Error("UserName / Email / Number already exists");

    // 2. Sponsor nikal lo, bas ancestors banane ke liye
    let sponsor = null;
    let ancestors = [];
    if (sponsorUserName) {
      sponsor = await User.findOne({ userName: sponsorUserName.toLowerCase() });
      if (sponsor) {
        ancestors = [sponsor._id, ...(sponsor.ancestors || [])].slice(0, 5);
      }
    }

    // 3. Password hash
    const hashed = await bcrypt.hash(password, 10);

    // 4. User create - BAS
    const newUser = await User.create({
      name,
      userName: userName.toLowerCase(),
      email: email.toLowerCase(),
      number,
      password: hashed,
      sponsor: sponsor?._id || null,
      ancestors,
      currentBundle: 0,
      volumePoints: 0,
      rank: "Beginner",
      isActive: false,
      wallet: { eWallet: 0, sWallet: 0, totalWithdrawn: 0 },
      stats: { directTeam: 0, totalTeam: 0, totalTeamSalesWX: 0 },
    });

    const safeUser = newUser.toObject();
    delete safeUser.password;

    return Response.json({
      success: true,
      user: safeUser,
      message: "User registered successfully",
    });
  } catch (e) {
    console.log("REGISTER ERROR:", e.message);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
