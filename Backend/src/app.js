import express from "express";
import cookieParser from "cookie-parser";
import prisma from "./config/db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/health", async (req, res) => {
  const userCount = await prisma.user.count();
  res.status(200).json({ success: true, message: "Server is healthy", userCount });
});

export default app;