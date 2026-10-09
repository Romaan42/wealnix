import connectDb from "@/lib/db";
import User from "@/models/User";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { id } = await params;
    const body = await req.json();
    const { action, value, reason } = body;

    const user = await User.findById(id);
    if (!user)
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );

    let message = "";

    switch (action) {
      case "status":
        // value = active | suspended | unverified
        if (!["active", "suspended", "unverified"].includes(value)) {
          return Response.json(
            { success: false, error: "Invalid status" },
            { status: 400 },
          );
        }
        user.status = value;
        message = `User status changed to ${value}`;
        break;

      case "wallet":
        // value = { type: eWallet|sWallet, amount, operation: add|subtract }
        const { type, amount, operation } = value;
        if (!["eWallet", "sWallet"].includes(type)) {
          return Response.json(
            { success: false, error: "Invalid wallet type" },
            { status: 400 },
          );
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
          return Response.json(
            { success: false, error: "Invalid amount" },
            { status: 400 },
          );
        }
        if (operation === "add") user.wallet[type] += numAmount;
        else {
          if (user.wallet[type] < numAmount) {
            return Response.json(
              { success: false, error: `Insufficient ${type} balance` },
              { status: 400 },
            );
          }
          user.wallet[type] -= numAmount;
        }
        message = `${operation === "add" ? "Added" : "Deducted"} WX$ ${numAmount} to ${type}`;
        break;

      case "rank":
        user.rank = value;
        message = `Rank updated to ${value}`;
        break;

      case "bundle":
        user.currentBundle = parseFloat(value);
        message = `Bundle updated to ${value}`;
        break;

      default:
        return Response.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    await user.save();
    return Response.json({ success: true, message, user });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
