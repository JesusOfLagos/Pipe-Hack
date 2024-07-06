import { Router, Request, Response } from "express";
import { NotificationController } from "./notification.controller";

export const notificationRouter = Router()
const notificationController = new NotificationController

notificationRouter.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: "notification Service Is Live!",
        status: 200
    })
})

notificationRouter.post('/create', notificationController.CreateNotification)
notificationRouter.post('/get/:id', notificationController.GetNotification)
notificationRouter.post('/get', notificationController.GetAllNotifications)
notificationRouter.post('/read/:id', notificationController.MarkNotificationAsRead)
notificationRouter.post('/read', notificationController.MarkAllAsRead)
