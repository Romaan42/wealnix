import mongoose from "mongoose";

const SupportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: ["deposit", "withdraw", "account", "other"],
      default: "other",
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "replied", "closed"],
      default: "open",
    },
    reply: { type: String, default: "" },
    repliedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", SupportSchema);
