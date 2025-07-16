import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface jwtPayload {
  userId: string;
}

export interface RequestWithUser extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as jwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Please login to continue!" });
    return;
  }
};
