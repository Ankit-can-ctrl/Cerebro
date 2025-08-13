import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: { type: String },
  link: String,
  description: String,
  type: {
    type: String,
    enum: ["youtube", "twitter", "document", "website", "image", "music"],
    required: true,
  },
  //tags field is an array which will store the id of the tags that point to tag model in another collection
  //   why we are using it : so that we dont have to duplicate the tags info in each content
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  // this is a foreign key to the user model
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const Content = mongoose.model("Content", contentSchema);
