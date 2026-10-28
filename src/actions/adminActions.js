// app/admin/login/actions.js
"use server";

import connectDb from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";

// export const adminLogin = async (data) => {
//   try {

//   } catch (error) {
//     console.error("adminLogin error:", error);
//     return {
//       success: false,
//       message: "Something went wrong",
//       error: "Something went wrong",
//     };
//   }
// };

// Logout action
export const adminLogout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("adminToken");
  return { success: true, message: "Logged out" };
};

export const deleteUser = async (id) => {
  try {
    await connectDb();
    await User.findByIdAndDelete(id);
    return { success: true, message: "user deleted success" };
  } catch (error) {
    return { success: false, message: "error while deleting user" };
  }
};
