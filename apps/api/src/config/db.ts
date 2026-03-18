import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
    try {
        await mongoose.connect(env.twilio.mongoUrl);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("DB connection error:", error);
        process.exit(1);
    }
};