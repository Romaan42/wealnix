import connectDb from "@/lib/db";
import checkUserLogin from "@/lib/checkUserLogin";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();
  const auth = await checkUserLogin();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = auth._id || auth.id || auth.userId;
  const user = await User.findById(userId)
    .select(
      "name email phone referralCode parentRank wallet volumePoints rank createdAt kycStatus",
    )
    .lean();

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({ success: true, user });
}

export async function PUT(req) {
  try {
    await connectDb();
    const userId = await checkUserLogin();
    if (!userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const body = await req.json();
    const {
      name,
      phone,
      cnic,
      dob,
      city,
      address,
      profilePic,
      cnicFront,
      cnicBack,
    } = body;

    // CNIC Validation (optional)
    if (cnic && cnic.replace(/[^0-9]/g, "").length < 13) {
      return NextResponse.json(
        { success: false, error: "Invalid CNIC - 13 digits required" },
        { status: 400 },
      );
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) {
      updateData.phone = phone;
      updateData.number = phone; // tumhari schema me number required hai
    }
    if (cnic !== undefined) updateData.cnic = cnic;
    if (dob !== undefined) updateData.dob = dob;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (cnicFront !== undefined) updateData.cnicFront = cnicFront;
    if (cnicBack !== undefined) updateData.cnicBack = cnicBack;

    // Auto KYC status update
    if (cnicFront && cnicBack && cnic) {
      updateData.kycStatus = "submitted";
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    return NextResponse.json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (e) {
    console.error("Profile PUT error:", e);
    if (e.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Phone number already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 },
    );
  }
}
