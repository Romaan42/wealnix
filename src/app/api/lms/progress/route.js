import connectDb from "@/lib/db";
import Enrollment from "@/models/Enrollment";

export async function PUT(req) {
  await connectDb();
  const { userId, courseId, lessonId } = await req.json();

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  }).populate("course");
  if (!enrollment)
    return Response.json(
      { success: false, error: "Not enrolled" },
      { status: 404 },
    );

  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const total =
    enrollment.course.totalLessons || enrollment.course.lessons.length;
  enrollment.progress = Math.round(
    (enrollment.completedLessons.length / total) * 100,
  );
  if (enrollment.progress >= 100) enrollment.isCompleted = true;

  await enrollment.save();
  return Response.json({ success: true, enrollment });
}
