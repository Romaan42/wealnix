import connectDb from "@/lib/db";
import Withdraw from "@/models/Withdraw";
import User from "@/models/User";

export async function POST(req) {
  await connectDb();
  const { withdrawId, action } = await req.json(); // approved / rejected
  const wd = await Withdraw.findById(withdrawId);
  if (!wd) return Response.json({ error: "Not found" }, { status: 404 });

  if (action === "rejected") {
    // Refund
    await User.findByIdAndUpdate(wd.user, {
      $inc: { "wallet.eWallet": wd.amountWX },
    });
  }
  wd.status = action;
  await wd.save();
  return Response.json({ success: true });
}
