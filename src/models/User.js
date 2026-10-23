import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // === PROFILE & KYC FIELDS (NEW) ===
    phone: { type: String, default: "" }, // alias for number
    profilePic: { type: String, default: "" }, // Cloudinary URL
    cnic: { type: String, default: "", trim: true }, // 42101-1234567-1
    dob: { type: String, default: "" }, // YYYY-MM-DD
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    cnicFront: { type: String, default: "" }, // Cloudinary URL
    cnicBack: { type: String, default: "" }, // Cloudinary URL

    // KYC & Referral
    kycStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "rejected"],
      default: "pending",
    },
    kycReason: { type: String, default: "" }, // rejection reason

    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ancestors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // 5 tak

    currentBundle: { type: Number, default: 0 }, // 20,50,100,150,200
    volumePoints: { type: Number, default: 0 }, // VP for rank
    rank: { type: String, default: null },

    // Wallet sab WX$ me store hoga
    wallet: {
      eWallet: { type: Number, default: 0 }, // 80%
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
