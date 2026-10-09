import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amountPKR: { type: Number, required: true },
    amountWX: { type: Number, required: true }, // PKR / 100
    method: {
      type: String,
      enum: ["jazzcash", "easypaisa", "usdt", "bank"],
      default: "jazzcash",
    },
    trxId: { type: String }, // JazzCash/EasyPaisa Txn ID user dega
    screenshot: { type: String }, // Proof image url
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.models.Deposit ||
  mongoose.model("Deposit", DepositSchema);
