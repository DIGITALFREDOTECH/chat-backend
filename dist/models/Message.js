// Message.ts
import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom" },
    timestamp: { type: Date, default: Date.now },
    email: { type: String },
});
export default mongoose.model("Message", messageSchema);
//# sourceMappingURL=Message.js.map