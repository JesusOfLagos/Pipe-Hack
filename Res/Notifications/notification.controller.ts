import { Request, Response } from "express";

export class NotificationController {
    public async CreateNotification (req: Request, res: Response) {
        try {
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
    public async MarkNotificationAsRead (req: Request, res: Response) {
        try {
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
    public async MarkAllAsRead (req: Request, res: Response) {
        try {
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
    public async GetNotification (req: Request, res: Response) {
        try {
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
    public async GetAllNotifications (req: Request, res: Response) {
        try {
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
}