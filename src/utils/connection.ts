import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();
const mongoURI = process.env.MONGODB_URI || "";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
