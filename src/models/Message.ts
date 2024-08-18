// Message.ts
import mongoose from "mongoose";

interface Message {
  message: string;
  userId: mongoose.Schema.Types.ObjectId;
  timestamp: Date;
  email: string;
  roomId: mongoose.Schema.Types.ObjectId;
}

const messageSchema = new mongoose.Schema<Message>({
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
  timestamp: { type: Date, default: Date.now },
  email: { type: String },
});

export default mongoose.model<Message>("Message", messageSchema);
