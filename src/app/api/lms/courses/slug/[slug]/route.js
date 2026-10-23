import connectDb from "@/lib/db";
import Course from "@/models/Course";

export async function GET(req, { params }) {
  await connectDb();
  const { slug } = await params;
  const course = await Course.findOne({ slug });
  if (!course) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ course });
}
