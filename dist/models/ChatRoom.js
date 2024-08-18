import mongoose from "mongoose";
const chatRoomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String }, // Optional image URL
    userCount: { type: Number, default: 1 }, // Initial user count is 1 for creator
});
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
export default ChatRoom;
//# sourceMappingURL=ChatRoom.js.map