import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "https://chat-frontend-a9yf.onrender.com" } });
io.on("connection", (socket) => {
  // ...
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });
  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
  });
  socket.on("send_message", async (content) => {
    // const userId = req.user?._id; // Extract user ID from request (assuming middleware)
    const data = JSON.parse(content);
    const message = new Message({
      message: data.message,
      userId: data.userId,
      email: data.email,
      roomId: data.roomId,
      timestamp: new Date(data.timestamp),
    });
    await message.save();
    data["key"] = message._id.toString();
    // console.log(data);
    // Broadcast the message to all users in the room
    socket.emit("receive_message", JSON.stringify(data));
    console.log(data);
  });
  // ...
});
// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
//# sourceMappingURL=index.js.map
