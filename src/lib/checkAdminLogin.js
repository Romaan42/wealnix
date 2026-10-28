import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const checkAdminLogin = async () => {
  try {
    const cookieStore = await cookies(); // Next.js 16 me await lazmi
    const adminToken = cookieStore.get("adminToken")?.value;

    if (!adminToken) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

    // Role check
    if (decoded.role !== "admin") {
      return null;
    }

    // FIX: Lowercase compare karo, warna ADMIN_USERNAME = "Admin" aur token me "admin" to fail ho jayega
    const envUsername = (
      process.env.ADMIN_USERNAME ||
      process.env.USERNAME ||
      ""
    )
      .toLowerCase()
      .trim();
    const tokenUsername = (decoded.userName || "").toLowerCase().trim();

    if (tokenUsername !== envUsername) {
      return null;
    }

    // Success pe decoded data return karo, true nahi
    return decoded;
  } catch (error) {
    console.log("checkAdminLogin Error:", error.message);
    return null;
  }
};

export default checkAdminLogin;
