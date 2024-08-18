import mongoose from "mongoose";

interface ChatRoomInterface {
  name: string;
  users: mongoose.Schema.Types.ObjectId[];
  image?: string; // Optional image URL for the chat room
  userCount: number; // Number of users joined to the chat room
}

const chatRoomSchema = new mongoose.Schema<ChatRoomInterface>({
  name: { type: String, required: true, unique: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: { type: String }, // Optional image URL
  userCount: { type: Number, default: 1 }, // Initial user count is 1 for creator
});

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
