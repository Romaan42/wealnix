import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import User from "@/models/User";

export async function GET() {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = auth._id || auth.id || auth.userId;
  const user = await User.findById(userId)
    .select(
      "name email phone referralCode parentRank wallet volumePoints rank createdAt kycStatus",
    )
    .lean();

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({ success: true, user });
}

export async function PUT(req) {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = auth._id || auth.id || auth.userId;
  const { name, phone } = await req.json();

  const updated = await User.findByIdAndUpdate(
    userId,
    { name, phone },
    { new: true, select: "name email phone referralCode" },
  );

  return Response.json({
    success: true,
    message: "Profile updated",
    user: updated,
  });
}
