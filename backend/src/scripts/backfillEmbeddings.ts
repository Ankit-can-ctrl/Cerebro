import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { Content } from "../models/contentModel";
import { getEmbedding } from "../lib/embedding";

const envEmbeddingDimRaw = process.env.EMBEDDING_DIM ?? "";
const envEmbeddingDimParsed = parseInt(envEmbeddingDimRaw.trim(), 10);
const EMBEDDING_DIM = Number.isFinite(envEmbeddingDimParsed)
  ? envEmbeddingDimParsed
  : 1536;
const BATCH_SIZE = 5;
const DELAY_MS = 500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildText(doc: any): string {
  const tags = Array.isArray(doc.tags) ? doc.tags : [];
  return [doc.title, doc.description, tags.join(",")]
    .filter(Boolean)
    .join("\n");
}

async function main() {
  await connectDB();

  console.log(
    "EMBEDDING_MODEL",
    process.env.EMBEDDING_MODEL,
    "EMBEDDING_DIM",
    EMBEDDING_DIM,
    "OPENAI_BASE_URL",
    process.env.OPENAI_BASE_URL
  );

  // 1) Load candidates (missing or empty embeddings). You can also re-embed wrong-length docs.
  const candidates = await Content.find({
    $or: [{ embedding: { $exists: false } }, { embedding: { $size: 0 } }],
  }).exec();

  console.log(`Found ${candidates.length} docs to backfill`);
  console.log(
    "MODEL",
    process.env.EMBEDDING_MODEL,
    "DIM",
    EMBEDDING_DIM,
    "BASE",
    process.env.OPENAI_BASE_URL
  );

  // Determine expected dimension via a probe call to avoid ENV mismatches
  let EXPECTED_DIM = EMBEDDING_DIM;
  try {
    const probeDoc = candidates[0];
    const probeText = probeDoc ? buildText(probeDoc) : "dimension probe";
    const probeVector = await getEmbedding(probeText || "dimension probe");
    if (Array.isArray(probeVector)) {
      if (probeVector.length !== EMBEDDING_DIM) {
        console.warn(
          `Warning: ENV EMBEDDING_DIM=${EMBEDDING_DIM} but provider returned ${probeVector.length}. Using ${probeVector.length}.`
        );
      }
      EXPECTED_DIM = probeVector.length;
    }
  } catch (e) {
    console.warn("Probe embedding failed; falling back to ENV EMBEDDING_DIM.");
  }

  let processed = 0;
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const chunk = candidates.slice(i, i + BATCH_SIZE);
    await Promise.all(
      chunk.map(async (doc) => {
        try {
          const text = buildText(doc);
          if (!text) return;

          const vector = await getEmbedding(text);
          if (!Array.isArray(vector) || vector.length !== EXPECTED_DIM) {
            throw new Error(
              `dim mismatch: got ${
                Array.isArray(vector) ? vector.length : "not-an-array"
              }`
            );
          }

          doc.embedding = vector;
          await doc.save();
          processed += 1;
        } catch (err) {
          console.error(`Failed doc ${doc._id}:`, (err as Error).message);
        }
      })
    );
    console.log(
      `Progress: ${Math.min(i + BATCH_SIZE, candidates.length)}/${
        candidates.length
      }`
    );
    await sleep(DELAY_MS);
  }

  console.log(
    `Done. Successfully processed ${processed}/${candidates.length}.`
  );
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await mongoose.disconnect();
  process.exit(1);
});
