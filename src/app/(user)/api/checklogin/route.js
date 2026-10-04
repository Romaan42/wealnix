import checkUserLogin from "@/lib/checkUserLogin";
import connectDb from "@/lib/db";

export const GET = async () => {
  try {
    await connectDb();

    const user = await checkUserLogin();
    if (!user) {
      return Response.json(
        { success: false, message: "not logged in" },
        { status: 401 },
      );
    }

    return Response.json({ success: true, user });
  } catch (error) {
    console.log("ERROR", error);
    return Response.json(
      { success: false, message: "something went wrong" },
      { status: 500 },
    );
  }
};
