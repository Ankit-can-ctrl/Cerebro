import mongoose from "mongoose";

// creating schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// creating model
export const User = mongoose.model("User", userSchema);
