import { Request, Response } from "express";
import { User } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "User created successfully.", token });
  } catch (e) {
    res.status(500).json({
      error: "Some problem occured during signup please come back later.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found , please enter correct username." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }
    // here below we using JWT_SECRET_KEY! because we telling ts that it is not null
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "2h",
    });

    res.status(200).json({ message: "Logged in successfully.", token });
  } catch (e) {
    res.status(500).json({ error: "Some problem occured during login!" });
  }
};
