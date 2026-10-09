// app/admin/login/actions.js
"use server";

import connectDb from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const adminLogin = async (data) => {
  try {
    const cookieStore = await cookies();
    await connectDb();

    const { userName, password } = data || {};

    if (!userName || !password) {
      return {
        success: false,
        message: "Username and password required",
        error: "Username and password required",
      };
    }

    // Env check - case insensitive for username
    const envUsername = process.env.ADMIN_USERNAME || process.env.USERNAME;
    const envPassword = process.env.ADMIN_PASSWORD || process.env.PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!envUsername || !envPassword || !jwtSecret) {
      console.error("Missing ENV: ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET");
      return {
        success: false,
        message: "Server configuration error",
        error: "Server configuration error",
      };
    }

    if (
      envUsername.toLowerCase() !== userName.toLowerCase().trim() ||
      envPassword !== password // password case sensitive
    ) {
      return {
        success: false,
        message: "Username or password is incorrect",
        error: "Username or password is incorrect",
      };
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

    return { success: true, message: "Admin logged in successfully" };
  } catch (error) {
    console.error("adminLogin error:", error);
    return {
      success: false,
      message: "Something went wrong",
      error: "Something went wrong",
    };
  }
};

// Logout action
export const adminLogout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("adminToken");
  return { success: true, message: "Logged out" };
};
