import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server"; // <-- Ye import add karo

export const POST = async (request) => {
  try {
    const { userName, password } = await request.json();

    if (!userName || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password required" },
        { status: 400 },
      );
    }

    const envUsername = process.env.ADMIN_USERNAME || process.env.USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD || process.env.PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!envUsername || !envPassword || !jwtSecret) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 },
      );
    }

    if (
      envUsername.toLowerCase() !== userName.toLowerCase().trim() ||
      envPassword !== password
    ) {
      return NextResponse.json(
        { success: false, message: "Username or password is incorrect" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { userName: envUsername.toLowerCase(), role: "admin" },
      jwtSecret,
      { expiresIn: "7d" },
    );

    // IMPORTANT FIX: NextResponse pe cookie set karo, cookieStore pe nahi
    const response = NextResponse.json({
      success: true,
      message: "Admin logged in successfully",
    });

    response.cookies.set("adminToken", token, {
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json(
      { success: false, message: "something went wrong" },
      { status: 500 },
    );
  }
};
