import mongoose from "mongoose";

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://retty:retty@cluster0.y8tnqk8.mongodb.net/');
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
    }
    }