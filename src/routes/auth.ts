import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";
import { configDotenv } from "dotenv";

configDotenv();

const authRouter = express.Router();

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

authRouter.post("/register", async (req: Request, res: Response) => {
  const { email, password, full_name } = req.body;
  console.log(req.body);
  try {
    const user = new User({ email, passwordHash: password, full_name });
    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET!
    );
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        error: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

authRouter.post("/logout", authMiddleware, (req: Request, res: Response) => {
  // Implement token revocation or logout logic here (optional)
  res.send("Logged out");
});

authRouter.get("/protected", authMiddleware, (req: Request, res: Response) => {
  res.send(req.user);
});

export default authRouter;
