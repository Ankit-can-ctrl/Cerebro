import { Router, RequestHandler } from "express";
import { createLink, getLinkContent } from "../controllers/linkController";
import { authMiddleware } from "../middleware/authmiddleware";
const router = Router();

router.post("/share", authMiddleware, createLink as RequestHandler);
router.get("/:hash", getLinkContent as RequestHandler);

export default router;
