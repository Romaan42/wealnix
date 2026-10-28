// src/lib/checkAdminLoginProxy.js
import jwt from "jsonwebtoken";

export function checkAdminLoginProxy(request) {
  try {
    const adminToken = request.cookies.get("adminToken")?.value;
    if (!adminToken) return null;

    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

    if (decoded.role !== "admin") return null;

    const envUsername = (process.env.ADMIN_USERNAME || "").toLowerCase().trim();
    if (decoded.userName.toLowerCase().trim() !== envUsername) return null;

    return decoded;
  } catch {
    return null;
  }
}
