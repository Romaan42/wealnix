import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 5 tak

    currentBundle: { type: Number, default: 0 }, // 20,50,100,150,200
    volumePoints: { type: Number, default: 0 }, // VP for rank
    rank: { type: String, default: "Beginner" },

    // Wallet sab WX$ me store hoga
    wallet: {
      eWallet: { type: Number, default: 0 }, // DECIMAL(12,2) - 80%
      sWallet: { type: Number, default: 0 }, // 20%
      totalWithdrawn: { type: Number, default: 0 },
    },

    stats: {
      directTeam: { type: Number, default: 0 },
      totalTeam: { type: Number, default: 0 },
      totalTeamSalesWX: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "unverified"],
      default: "active",
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
