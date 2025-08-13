import { Response, NextFunction, Request } from "express";
import { RequestWithUser } from "../middleware/authmiddleware";
import { Content } from "../models/contentModel";
import cloudinary from "../config/cloudinary";

export const postContent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, link, description, type } = req.body;

    // Input validation
    if (!title || !link || !type) {
      res.status(400).json({
        error: "Title, link and type are required fields.",
      });
      return;
    }

    await Content.create({
      title,
      link,
      description,
      userId: req.userId,
      type,
      tags: [],
    });

    res.status(201).json({ message: "Content added successfully." });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong while creating content.",
    });
  }
};

export const getContent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    // populate means bring the userId's data from the the user model as well cos it is a foreign key
    // now the userId object will have all user model data as well
    // const content = await Content.find({ userId: userId }).populate("userId");
    // we can also specify the fields we want to populate cos we dont need all the fields from the user model
    const content = await Content.find({ userId: userId }).populate(
      "userId",
      "username"
    );
    res.status(200).json({ content });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong while fetching content.",
    });
  }
};

export const removeContent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contentId } = req.body; // Fixed: extract contentId from body

    // Input validation
    if (!contentId) {
      res.status(400).json({
        error: "Content ID is required.",
      });
      return;
    }

    const result = await Content.deleteOne({
      _id: contentId,
      userId: req.userId,
    }); // Changed to deleteOne for single content deletion

    if (result.deletedCount === 0) {
      res.status(404).json({
        error: "Content not found or unauthorized.",
      });
      return;
    }

    res.status(200).json({ message: "Content deleted successfully." });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong while deleting content.",
    });
  }
};

// Upload image to Cloudinary via multipart form-data
export const uploadImage = async (
  req: RequestWithUser & Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      res.status(500).json({
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env",
      });
      return;
    }
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ error: "Image file is required." });
      return;
    }

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "cerebro/uploads" },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(file.buffer);
    });

    res.status(200).json(uploadResult);
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    const message = (error as any)?.message || "Failed to upload image.";
    res.status(500).json({ error: message });
  }
};

// Upload image to Cloudinary by URL
export const uploadImageByUrl = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      res.status(500).json({
        error:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in backend/.env",
      });
      return;
    }
    const { imageUrl } = req.body as { imageUrl?: string };
    if (!imageUrl) {
      res.status(400).json({ error: "imageUrl is required." });
      return;
    }
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "cerebro/uploads",
    });
    res
      .status(200)
      .json({ secure_url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload by URL error:", error);
    const message =
      (error as any)?.message || "Failed to upload image from URL.";
    res.status(500).json({ error: message });
  }
};
