import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const POST = async (request) => {
  try {
    const cookieStore = await cookies();

    const { userName, password } = await request.json();

    if (!userName || !password) {
      return Response.json(
        {
          success: false,
          message: "Username and password required",
          error: "Username and password required",
        },
        { status: 404 },
      );
    }

    // Env check - case insensitive for username
    const envUsername = process.env.ADMIN_USERNAME || process.env.USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD || process.env.PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!envUsername || !envPassword || !jwtSecret) {
      return Response.json(
        {
          success: false,
          message: "Server configuration error",
          error: "Server configuration error",
        },
        { status: 401 },
      );
    }

    if (
      envUsername.toLowerCase() !== userName.toLowerCase().trim() ||
      envPassword !== password // password case sensitive
    ) {
      return Response.json(
        {
          success: false,
          message: "Username or password is incorrect",
          error: "Username or password is incorrect",
        },
        { status: 404 },
      );
    }

    // NEVER sign password in token - only role
    const token = jwt.sign(
      { userName: envUsername.toLowerCase(), role: "admin" },
      jwtSecret,
      { expiresIn: "7d" },
    );

    cookieStore.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return Response.json({
      success: true,
      message: "Admin logged in successfully",
    });
  } catch (error) {
    console.log("ERROR", error);
    return Response.json(
      { success: false, message: "something went wrong" },
      { status: 500 },
    );
  }
};
