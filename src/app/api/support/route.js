import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import SupportTicket from "@/models/SupportTicket";

export async function GET() {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = auth._id || auth.id;
  const tickets = await SupportTicket.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
  return Response.json({ success: true, tickets });
}

export async function POST(req) {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const userId = auth._id || auth.id;
  const { subject, category, message } = await req.json();

  if (!subject || !message)
    return Response.json(
      { error: "Subject & message required" },
      { status: 400 },
    );

  const ticket = await SupportTicket.create({
    user: userId,
    subject,
    category,
    message,
  });

  return Response.json({
    success: true,
    message: "Ticket sent to support",
    ticket,
  });
}
