import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import User from "@/models/User";

export async function GET() {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findById(auth._id)
    .select("wallet volumePoints rank")
    .lean();
  return Response.json({
    success: true,
    wallet: user.wallet,
    rank: user.rank,
    vp: user.volumePoints,
  });
}
