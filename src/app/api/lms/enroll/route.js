import connectDb from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export async function POST(req) {
  await connectDb();
  const { userId, courseId } = await req.json();

  const exists = await Enrollment.findOne({ user: userId, course: courseId });
  if (exists)
    return Response.json({
      success: true,
      enrollment: exists,
      message: "Already enrolled",
    });

  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
  });
  return Response.json({ success: true, enrollment });
}
