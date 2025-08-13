import { Router } from "express";
import { authMiddleware } from "../middleware/authmiddleware";
import {
  getContent,
  postContent,
  removeContent,
  uploadImage,
  uploadImageByUrl,
  uploadAudio,
  uploadAudioByUrl,
} from "../controllers/contentController";
import multer from "multer";

const contentRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

contentRouter.get("/get", authMiddleware, getContent);
contentRouter.post("/post", authMiddleware, postContent);
contentRouter.delete("/remove", authMiddleware, removeContent);
contentRouter.post(
  "/upload/image",
  authMiddleware,
  upload.single("image"),
  uploadImage
);
contentRouter.post("/upload/image-by-url", authMiddleware, uploadImageByUrl);

contentRouter.post(
  "/upload/audio",
  authMiddleware,
  upload.single("audio"),
  uploadAudio
);
contentRouter.post("/upload/audio-by-url", authMiddleware, uploadAudioByUrl);

export default contentRouter;
