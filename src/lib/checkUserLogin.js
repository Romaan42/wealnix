import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDb from "./db";

const checkUserLogin = async () => {
  try {
    await connectDb();
    const cookiesStore = await cookies();
    const token = cookiesStore.get("userToken")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return null;

    const user = await User.findById(decoded.id).lean(); // await lagana zaruri tha
    if (!user) return null;

    return { userId: user._id, ...user }; // taake userId bhi mile aur user data bhi
  } catch (error) {
    console.log("checkUserLogin error:", error.message);
    return null;
  }
};

export default checkUserLogin;
