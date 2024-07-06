import { Schema, model } from "mongoose";

const notificationSchema: Schema = new Schema ({
    user: {}
})

export const UserNotification = model('Notifications', notificationSchema)