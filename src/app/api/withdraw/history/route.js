import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import Withdraw from "@/models/Withdraw";

export async function GET() {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const history = await Withdraw.find({ user: auth._id })
    .sort({ createdAt: -1 })
    .lean();
  const total = history
    .filter((h) => h.status === "approved")
    .reduce((s, h) => s + h.netWX, 0);
  const pending = history
    .filter((h) => h.status === "pending")
    .reduce((s, h) => s + h.amountWX, 0);

  return Response.json({ success: true, history, stats: { total, pending } });
}
