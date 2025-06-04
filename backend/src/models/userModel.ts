import mongoose from "mongoose";

// creating schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// creating model
const User = mongoose.model("User", userSchema);

export default User;
