import express from "express";
import connectDB from "./config/db";
import authRouter from "./routes/userRoutes";
import contentRouter from "./routes/contentRoutes";
import linkRouter from "./routes/linkRoutes";
import dotenv from "dotenv"; //this is necessary for importing .env variables at very beginning
import cors from "cors";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/link", linkRouter);

app.listen(3000, () => {
  console.log(`Server started on 3000`);
});
