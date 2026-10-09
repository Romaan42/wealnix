import mongoose from "mongoose";

const WithdrawSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amountWX: { type: Number, required: true }, // User ne jo manga
    taxWX: { type: Number, required: true }, // 10%
    netWX: { type: Number, required: true }, // amount - tax
    amountPKR: { type: Number, required: true },
    method: {
      type: String,
      enum: ["jazzcash", "easypaisa", "bank", "usdt"],
      default: "jazzcash",
    },
    accountTitle: { type: String, required: true },
    accountNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Withdraw ||
  mongoose.model("Withdraw", WithdrawSchema);
