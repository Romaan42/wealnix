import connectDb from "@/lib/db";
import SupportTicket from "@/models/SupportTicket";

export async function PUT(req, { params }) {
  try {
    await connectDb();
    const { id } = await params;
    const { action, reply } = await req.json(); // action: reply | close | reopen

    const ticket = await SupportTicket.findById(id);
    if (!ticket)
      return Response.json(
        { success: false, error: "Ticket not found" },
        { status: 404 },
      );

    if (action === "reply") {
      if (!reply || reply.trim().length < 5) {
        return Response.json(
          { success: false, error: "Reply minimum 5 characters" },
          { status: 400 },
        );
      }
      ticket.reply = reply;
      ticket.status = "replied";
      ticket.repliedAt = new Date();
    } else if (action === "close") {
      ticket.status = "closed";
    } else if (action === "reopen") {
      ticket.status = "open";
    } else {
      return Response.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    await ticket.save();
    return Response.json({
      success: true,
      message: `Ticket ${action} successfully`,
      ticket,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
