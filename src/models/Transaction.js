import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // KIS TYPE KA Paisa hai
    type: {
      type: String,
      enum: [
        "Deposit",
        "Withdraw",
        "Direct",
        "Team",
        "Binary",
        "ROI",
        "E-Wallet",
        "S-Wallet",
        "Penalty",
      ],
      required: true,
    },

    // KITNA
    amount: { type: Number, required: true }, // +100 for credit, -50 for debit
    wxAmount: { type: Number }, // WX me

    // KAHA SE AAYA? (Ye client ka main sawal hai)
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fromUserName: { type: String }, // denormalize for fast query
    fromUserIdCode: { type: String }, // e.g. WLN1234

    // LINK - kis Deposit/Withdraw se ye transaction bana?
    relatedDeposit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deposit",
      default: null,
    },
    relatedWithdraw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdraw",
      default: null,
    },

    // Level for team commission
    level: { type: Number, default: 1 }, // Level 1, Level 2...

    description: { type: String }, // e.g. "Direct commission from Ali"

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },

    // 80/20 Split track karna hai to
    splitInfo: {
      eWallet: { type: Number, default: 0 },
      sWallet: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

transactionSchema.index({ userId: 1, type: 1, createdAt: -1 });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
