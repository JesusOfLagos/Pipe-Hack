import { Schema, model } from "mongoose";

export const userProfileSchema = new Schema({
    userId: { type: String, required: true },
    isKYCApproved: { type: Boolean, default: false },
    wallets: { type: [String], default: [] },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    zip: { type: String, required: false },
    notifications: { type: {
        mobile: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        login: { type: Boolean, default: true },
        desktop: { type: Boolean, default: true },
    }, default: { email: true, mobile: true, login: true, desktop: true } },
    security: { type: {
        fa: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        mobile: { type: Boolean, default: true }
    }, default: { email: true, mobile: true, fa: true }}
}, { timestamps: true });


export const UserProfileModel = model("UserProfile", userProfileSchema);