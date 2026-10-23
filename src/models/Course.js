import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: String, // youtube / vimeo / s3
    content: String, // rich text
    duration: Number, // in minutes
    isFree: { type: Boolean, default: false },
    resources: [{ title: String, url: String }],
  },
  { _id: true },
);

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    thumbnail: String,
    rankRequired: { type: String, default: "Beginner" }, // Beginner, Bronze, Silver...
    bundleRequired: { type: Number, default: 0 }, // 0 = free for all active users
    lessons: [LessonSchema],
    totalLessons: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
