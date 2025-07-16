import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import connectDB from "./config/db";
import authRouter from "./routes/userRoutes";
import contentRouter from "./routes/contentRoutes";
import dotenv from "dotenv"; //this is necessary for importing .env variables at very beginning

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/content", contentRouter);

app.listen(3000, () => {
  console.log(`Server started on 3000`);
});
