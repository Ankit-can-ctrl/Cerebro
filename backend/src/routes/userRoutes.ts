import { RequestHandler, Router } from "express";
import { signup, login } from "../controllers/authController";

const router = Router();

router.post("/signup", signup as RequestHandler);
router.post("/login", login as RequestHandler);

export default router;
