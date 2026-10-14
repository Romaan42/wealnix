import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import Deposit from "@/models/Deposit";
import { WX_RATE } from "@/config/wealnex.config";

const BUNDLES = {
  20: { priceWX: 20, pricePKR: 2000, vp: 2, name: "Starter" },
  50: { priceWX: 50, pricePKR: 5000, vp: 5, name: "Silver" },
  100: { priceWX: 100, pricePKR: 10000, vp: 10, name: "Gold" },
  150: { priceWX: 150, pricePKR: 15000, vp: 15, name: "Platinum" },
  200: { priceWX: 200, pricePKR: 20000, vp: 20, name: "Diamond" },
};

export async function POST(req) {
  try {
    await connectDb();
    const auth = await checkUserLogin();
    if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { bundlePriceWX, method, trxId } = await req.json();

    // FIX: Sirf bundlePriceWX se validate karo, amountPKR/WX frontend se mat lo
    const bundle = BUNDLES[Number(bundlePriceWX)];
    if (!bundle) {
      return Response.json(
        { error: "Invalid Bundle. Valid: 20,50,100,150,200" },
        { status: 400 },
      );
    }

    if (!trxId || trxId.trim().length < 5) {
      return Response.json({ error: "Valid TrxID required" }, { status: 400 });
    }

    const existsTrx = await Deposit.findOne({ trxId: trxId.trim() });
    if (existsTrx) {
      return Response.json(
        { error: "This TrxID already used" },
        { status: 400 },
      );
    }

    // NO SESSION - Direct create (fix for replica set error)
    const dep = await Deposit.create({
      user: auth._id,
      amountPKR: bundle.pricePKR, // FIX: Fixed value, ghat nahi hogi
      amountWX: bundle.priceWX, // FIX: Fixed 20,50,100...
      bundleName: bundle.name,
      bundleVP: bundle.vp,
      method: method || "jazzcash",
      trxId: trxId.trim(),
      status: "pending",
    });

    return Response.json({
      success: true,
      message: `Deposit request for ${bundle.name} Bundle submitted.`,
      deposit: dep,
      youWillGet: `${bundle.priceWX} WX$ + ${bundle.vp} VP after approval`,
    });
  } catch (e) {
    console.error("Deposit Request Error:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
