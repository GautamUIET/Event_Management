import User from "../../models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "../../db";

connect();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

export const createSendToken = (user, statusCode, message) => {
  const token = signToken(user._id);

  const cookieOptions = [
    `token=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${24 * 60 * 60 * 90}`,
    process.env.NODE_ENV === "production" ? "Secure; SameSite=Strict" : "SameSite=Lax",
  ].join("; ");

  const response = NextResponse.json(
    {
      status: "success",
      message,
      token,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    },
    { status: statusCode }
  );

  response.headers.set("Set-Cookie", cookieOptions);

  return response;
};

export async function POST(req) {
  let user;

  try {
    const body = await req.json();
    const { name, email, password, passwordConfirm, role } = body;

    if (!name || !email || !password || !passwordConfirm) {
      return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
    }

    if (password !== passwordConfirm) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user = await User.create({
      name,
      email,
      role: role || "student",
      password: hashedPassword,
      passwordConfirm,
    });

    return createSendToken(user, 201, "User Created Successfully");
  } catch (error) {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    console.error("Error during registration:", error.message);
    return NextResponse.json({ error: error.message || "Error while processing the request" }, { status: 500 });
  }
}
