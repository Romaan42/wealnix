import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import Deposit from "@/models/Deposit";

export async function GET() {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const deposits = await Deposit.find({ user: auth._id })
    .sort({ createdAt: -1 })
    .lean();

  const total = deposits.reduce((s, d) => s + d.amountPKR, 0);
  const pending = deposits
    .filter((d) => d.status === "pending")
    .reduce((s, d) => s + d.amountPKR, 0);
  const successful = deposits
    .filter((d) => d.status === "approved")
    .reduce((s, d) => s + d.amountPKR, 0);

  return Response.json({
    success: true,
    history: deposits,
    stats: { total, pending, success: successful },
  });
}
