import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { Content } from "../models/contentModel";

async function main() {
  await connectDB();

  const targetLenRaw = process.env.CLEAR_EMBED_LEN || "192";
  const targetLen = parseInt(String(targetLenRaw).trim(), 10);
  if (!Number.isFinite(targetLen) || targetLen <= 0) {
    throw new Error(`Invalid CLEAR_EMBED_LEN: ${targetLenRaw}`);
  }

  console.log(`Clearing embeddings with length exactly ${targetLen}...`);
  const filter: any = {
    [`embedding.${targetLen - 1}`]: { $exists: true },
  };
  filter[`embedding.${targetLen}`] = { $exists: false };

  const res = await Content.updateMany(filter, { $set: { embedding: [] } });
  console.log(`Matched: ${res.matchedCount}  Modified: ${res.modifiedCount}`);

  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
