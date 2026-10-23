import connectDb from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";

const RANK_ORDER = [
  "Beginner",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Crown Director",
];

export async function GET(req) {
  await connectDb();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const courses = await Course.find({ status: "published" }).sort({
    createdAt: -1,
  });

  if (!userId) return Response.json({ success: true, courses });

  const user = await User.findById(userId);
  const userRankIndex = RANK_ORDER.indexOf(user?.rank || "Beginner");

  const filtered = courses.filter((c) => {
    const reqIndex = RANK_ORDER.indexOf(c.rankRequired);
    return (
      userRankIndex >= reqIndex && (user.currentBundle || 0) >= c.bundleRequired
    );
  });

  return Response.json({ success: true, courses: filtered });
}

export async function POST(req) {
  try {
    await connectDb();
    const body = await req.json();

    if (!body.thumbnailPublicId) throw new Error("Thumbnail required");

    const slug =
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    // Clean lessons: sirf publicId save karo as main
    const cleanLessons = body.lessons.map((l) => ({
      title: l.title,
      publicId: l.publicId, // MAIN FIELD
      videoUrl: l.videoUrl, // backup
      duration: l.duration || "0:00",
      isFree: l.isFree,
      content: l.content || "",
    }));

    const course = await Course.create({
      title: body.title,
      slug,
      description: body.description,
      thumbnail: body.thumbnail,
      thumbnailPublicId: body.thumbnailPublicId, // MAIN
      rankRequired: body.rankRequired,
      bundleRequired: body.bundleRequired,
      lessons: cleanLessons,
      totalLessons: cleanLessons.length,
    });

    return Response.json({ success: true, course });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 400 },
    );
  }
}
