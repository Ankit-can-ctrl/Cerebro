import { Router } from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import {
  getContent,
  postContent,
  removeContent,
} from "../controllers/contentController";

const contentRouter = Router();

contentRouter.post("/post", authMiddleware, postContent);
contentRouter.get("/get", authMiddleware, getContent);
contentRouter.delete("/remove", authMiddleware, removeContent);

export default contentRouter;
