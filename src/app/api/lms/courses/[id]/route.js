import connectDb from "@/lib/db";
import Course from "@/models/Course";

export async function DELETE(req, { params }) {
  await connectDb();
  await Course.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}

export async function GET(req, { params }) {
  await connectDb();
  const { id } = await params;
  const course = await Course.findById(id);
  return Response.json({ course });
}

export async function PUT(req, { params }) {
  await connectDb();
  const body = await req.json();
  const updated = await Course.findByIdAndUpdate(
    params.id,
    { ...body, totalLessons: body.lessons.length },
    { new: true },
  );
  return Response.json({ success: true, course: updated });
}
