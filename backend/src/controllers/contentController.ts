import { Response, NextFunction } from "express";
import { RequestWithUser } from "../middleware/authmiddleware";
import { Content } from "../models/contentModel";

export const postContent = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, link } = req.body;

    // Input validation
    if (!title || !link) {
      res.status(400).json({
        error: "Title and link are required fields.",
      });
      return;
    }

    await Content.create({
      title,
      link,
      userId: req.userId,
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
