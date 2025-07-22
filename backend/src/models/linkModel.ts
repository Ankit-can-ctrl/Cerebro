import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  link: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const Link = mongoose.model("Link", linkSchema);
