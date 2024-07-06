import { Schema, model } from "mongoose";


const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // firstname: { type: String, required: true },
    role: { type: String, required: true },
    // lastname: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpiresIn: { type: Date, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})



export const UserModel = model("User", userSchema);