import connectDb from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (request) => {
  try {
    await connectDb();
    const cookiesStore = await cookies();
    const { identifier, password } = await request.json();

    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 404 },
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
    );
    cookiesStore.set("userToken", token, {
      maxAge: 24 * 60 * 60 * 60 * 1000,
    });
    return Response.json(
      { success: true, message: "logged in successfuly" },
      { status: 201 },
    );
  } catch (error) {
    console.log("ERROR", error);
    return Response.json(
      { success: false, message: "something went wrong" },
      { status: 500 },
    );
  }
};
