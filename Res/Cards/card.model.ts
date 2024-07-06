import { Model, Schema, model } from "mongoose";

const virtualCardSchema: Schema = new Schema({
    user: { type: String, required: true },
    balance: { type: Number, default: 0 },
    type: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
})

export const VirtualCard = model('VirtualCard', virtualCardSchema)

const cardSchema: Schema = new Schema({
    userId: { type: String, required: true },
    cvv: { type: String, required: true },
    exp: { type: String, required: true },
    name: { type: String, required: true },
    cardNo: { type: String, required: true },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
})

export const Card = model('Card', cardSchema)