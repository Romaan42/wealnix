import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import checkUserLogin from "@/lib/checkUserLogin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDb();
    const session = await checkUserLogin();
    if (!session?.userId)
      return NextResponse.json({ success: false }, { status: 401 });

    const topUsers = await User.find({ sponsor: session.userId })
      .sort({ volumePoints: -1, currentBundle: -1 })
      .limit(3)
      .select("name userName volumePoints currentBundle wallet")
      .lean();

    const partners = topUsers.map((u) => ({
      name: u.name || u.userName,
      earnings: `WX$${(u.volumePoints || u.currentBundle || 0).toLocaleString()}`,
      sub: `Bundle: $${u.currentBundle}`,
      avatar: (u.name?.[0] || u.userName?.[0] || "U").toUpperCase(),
    }));

    return NextResponse.json({ success: true, partners });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}
