import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  const mongodbUrl = process.env.MONGO_URL as string;
  try {
    await mongoose.connect(mongodbUrl);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
