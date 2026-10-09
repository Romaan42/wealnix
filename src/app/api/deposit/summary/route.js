import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import Deposit from "@/models/Deposit";

export async function GET() {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const agg = await Deposit.aggregate([
    { $match: { user: auth._id } },
    {
      $group: {
        _id: "$status",
        totalPKR: { $sum: "$amountPKR" },
        count: { $sum: 1 },
      },
    },
  ]);

  let total = 0,
    pending = 0,
    successful = 0;
  agg.forEach((a) => {
    total += a.totalPKR;
    if (a._id === "pending") pending = a.totalPKR;
    if (a._id === "approved") successful = a.totalPKR;
  });

  return Response.json({ total, pending, successful });
}
