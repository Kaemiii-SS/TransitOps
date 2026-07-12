import bcrypt from "bcryptjs";
import prisma from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";

const VALID_ROLES = ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const signup = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new ApiError(400, "Email, password, and role are required");
  }

  if (!VALID_ROLES.includes(role)) {
    throw new ApiError(400, `Role must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, role },
    select: { id: true, email: true, role: true, createdAt: true }, // never select passwordHash back
  });

  const token = generateToken(user.id, user.role);
  res.cookie("token", token, cookieOptions);

  return res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = generateToken(user.id, user.role);
  res.cookie("token", token, cookieOptions);

  const safeUser = { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };

  return res.status(200).json(new ApiResponse(200, safeUser, "Login successful"));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by auth.middleware.js
  return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched"));
});

export { signup, login, logout, getMe };