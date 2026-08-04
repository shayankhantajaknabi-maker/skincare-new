import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminToken } from "@/lib/auth";
import { Admin } from "@/models/Admin";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email and password" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordCorrect = await bcrypt.compare(
      parsed.data.password,
      admin.passwordHash
    );

    if (!passwordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createAdminToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });

    response.cookies.set("nm_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to sign in" },
      { status: 500 }
    );
  }
}