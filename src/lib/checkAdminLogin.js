import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const checkAdminLogin = async () => {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("adminToken")?.value;
    if (!adminToken) return null;

    const decode = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decode.userName !== process.env.ADMIN_USERNAME) {
      return null;
    }

    return true;
  } catch (error) {
    return true;
  }
};

export default checkAdminLogin;
