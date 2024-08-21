import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import ChatRoom from "./models/ChatRoom.js";
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    // ...
    // console.log(`User connected ${socket.id}`);
    socket.on("join_room", async ({ user, room }) => {
        console.log(user);
        // console.log(socket.rooms); //
        console.log(room);
        socket.join(room._id);
        try {
            const chatRoom = await ChatRoom.findById(room._id);
            if (chatRoom) {
                if (!chatRoom.users.includes(user._id)) {
                    chatRoom.users.push(user._id);
                    chatRoom.userCount++; // Increment user count
                    await chatRoom.save();
                    room.userCount += 1;
                    socket.emit("events", { user, room });
                }
            }
        }
        catch (error) {
            console.log(error);
        }
        socket.emit("receive_message", JSON.stringify({
            message: `${user.full_name} Joined`,
            userId: user._id,
            email: user.email,
            timestamp: new Date(),
            roomId: room._id,
            event: true,
        }));
    });
    socket.on("leave_room", ({ room, user }) => {
        console.log(user);
        socket.leave(room._id);
        socket.emit("receive_message", JSON.stringify({
            message: `${user.full_name} Left`,
            userId: user._id,
            email: user.email,
            timestamp: new Date(),
            roomId: room._id,
            event: true,
        }));
        // room.userCount -= 1;
        // socket.emit("events", { user, room });
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
            event: data.event,
        });
        await message.save();
        data["key"] = message._id.toString();
        data["_id"] = message._id.toString();
        // console.log(data);
        // Broadcast the message to all users in the room
        // socket.join(data.roomId);
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
