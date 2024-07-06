import mongoose from "mongoose";
import config from "./config/config";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(config.db.mongodb.MONGO_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
    }