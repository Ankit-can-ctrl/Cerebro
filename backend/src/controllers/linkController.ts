import { Response } from "express";
import { Link } from "../models/linkModel";
import { randomString } from "../config/random";
import { RequestWithUser } from "../middleware/authmiddleware";
import { User } from "../models/userModel";
import { Content } from "../models/contentModel";

export const createLink = async (req: RequestWithUser, res: Response) => {
  try {
    // when share is true, we need to create a new link , if share is false then we need to disable or
    // delete the link
    const share = req.body.share;

    if (share) {
      // If share is true, create or get existing link
      const existingLink = await Link.findOne({ userId: req.userId });

      if (existingLink) {
        res.json({ hash: existingLink.hash });
        return;
      }

      const hash = randomString(10);
      await Link.create({
        userId: req.userId,
        hash: hash,
      });
      res.status(201).json({ message: hash });
    } else {
      // If share is false, delete the link
      await Link.deleteOne({ userId: req.userId });
      res.status(200).json({ message: "Link deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating link" });
  }
};

export const getLinkContent = async (req: RequestWithUser, res: Response) => {
  try {
    const hash = req.params.hash;

    const link = await Link.findOne({ hash });
    if (!link) {
      res.status(404).json({ message: "Link not found!" });
      return;
    }
    const content = await Content.find({ userId: link.userId });

    const user = await User.findById(link.userId);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    res.json({
      user: user.username,
      content: content,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching the data." });
  }
};
