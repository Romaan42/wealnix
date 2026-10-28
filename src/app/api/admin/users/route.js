import connectDb from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import checkAdminLogin from "@/lib/checkAdminLogin";

export async function GET(req) {
  try {
    // Admin check - Next.js 16 me await
    const isAdmin = await checkAdminLogin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDb();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const kyc = searchParams.get("kyc") || "all"; // new: pending, submitted, verified, rejected
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 20;

    const query = {};

    // Status filter
    if (status !== "all") query.status = status;

    // KYC filter
    if (kyc !== "all") query.kycStatus = kyc;

    // Search - ab CNIC + city bhi search hoga
    if (search) {
      const regex = { $regex: search, $options: "i" };
      query.$or = [
        { userName: regex },
        { email: regex },
        { number: regex },
        { name: regex },
        { cnic: regex }, // CNIC se search
        { city: regex },
        { phone: regex },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .populate("sponsor", "userName name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("GET /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
