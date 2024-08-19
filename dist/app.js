import express from "express";
import cors from "cors";
import "./utils/connection.js";
import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";
// // Import your Mongoose models
// import Message from "./src/models/Message";
// import User from "./src/models/User";
const app = express();
// Allow any origin for now (change for production)
// Configure middleware
app.use(cors({ origin: "https://onrender.com" }));
app.use(express.json()); // Parse incoming JSON data
app.use(authRouter);
app.use(chatRouter); // MongoDB connection (replace with your connection string)
// Socket.io connection handling
export default app;
//# sourceMappingURL=app.js.map
