import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDb from "./db";

const checkUserLogin = async () => {
  try {
    await connectDb();
    const cookiesStore = await cookies();
    const token = cookiesStore.get("userToken")?.value;
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return null;
    }
    const user = User.findById(decoded.id);
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

export default checkUserLogin;
