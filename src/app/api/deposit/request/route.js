import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import Deposit from "@/models/Deposit";
import { WX_RATE } from "@/config/wealnex.config";

export async function POST(req) {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { amountPKR, method, trxId } = await req.json();

  if (!amountPKR || amountPKR < 500) {
    return Response.json(
      { error: "Min deposit 500 PKR (5 WX$)" },
      { status: 400 },
    );
  }
  if (amountPKR > 50000) {
    return Response.json({ error: "Max deposit 50,000 PKR" }, { status: 400 });
  }

  const amountWX = amountPKR / WX_RATE;

  const dep = await Deposit.create({
    user: auth._id,
    amountPKR,
    amountWX,
    method: method || "jazzcash",
    trxId,
    status: "pending",
  });

  return Response.json({
    success: true,
    message: "Deposit request submitted. Admin will verify in 10-30 min.",
    deposit: dep,
    youWillGet: `${amountWX} WX$`,
  });
}
