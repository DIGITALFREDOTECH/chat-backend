import express, { Request, Response } from "express";
import ChatRoom from "../models/ChatRoom.js";
import { authMiddleware } from "../middleware/auth.js";

const chatRouter = express.Router();
chatRouter.use(authMiddleware);

chatRouter.post("/create", async (req: Request, res: Response) => {
  const { name, image_url } = req.body; // Include image_url

  try {
    const chatRoom = new ChatRoom({
      name,
      image: image_url,
      users: [req.user._id],
      userCount: 1,
    }); // Add user and userCount
    await chatRoom.save();
    res.send(chatRoom);
  } catch (error) {
    res.status(400).send(error);
    console.error(error); // Log the error for debugging
  }
});

chatRouter.get("/joined", async (req: Request, res: Response) => {
//   const { userId } = req.user; // Access user ID from req.user

  try {
    const joinedRooms = await ChatRoom.find({ users: { $in: [req.user._id] } }); // Find rooms with user ID
    res.send(joinedRooms);
  } catch (error) {
    res.status(500).send(error);
    console.error(error); // Log the error for debugging
  }
});

chatRouter.get("/", async (req: Request, res: Response) => {
  try {
    const chatRooms = await ChatRoom.find();
    res.send(chatRooms);
  } catch (error) {
    res.status(500).send(error);
    console.error(error); // Log the error for debugging
  }
});

chatRouter.post("/join/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user; // Access user ID from req.user

  try {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      return res.status(404).send("Chat room not found");
    }

    // Check if user is already joined
    if (chatRoom.users.includes(userId)) {
      return res.status(400).send("User already joined this room");
    }

    chatRoom.users.push(userId);
    chatRoom.userCount++; // Increment user count
    await chatRoom.save();
    res.send(chatRoom);
  } catch (error) {
    res.status(500).send(error);
    console.error(error); // Log the error for debugging
  }
});

chatRouter.post("/leave/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user; // Access user ID from req.user

  try {
    const chatRoom = await ChatRoom.findById(id);
    if (!chatRoom) {
      return res.status(404).send("Chat room not found");
    }

    const userIndex = chatRoom.users.indexOf(userId);
    if (userIndex === -1) {
      return res.status(400).send("User is not joined to this room");
    }

    chatRoom.users.splice(userIndex, 1);
    chatRoom.userCount--; // Decrement user count
    await chatRoom.save();
    res.send(chatRoom);
  } catch (error) {
    res.status(500).send(error);
    console.error(error); // Log the error for debugging
  }
});

export default chatRouter;
