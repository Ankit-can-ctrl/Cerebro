import { Router, RequestHandler } from "express";
import {
  createLink,
  getLinkContent,
  getLinkMetadata,
} from "../controllers/linkController";
import { authMiddleware } from "../middleware/authmiddleware";
const router = Router();

router.post("/share", authMiddleware, createLink as RequestHandler);
router.get("/:hash", getLinkContent as RequestHandler);
router.get("/metadata/fetch", getLinkMetadata as RequestHandler);

export default router;
