import { Request, Response } from "express";
import { Card } from "./card.model";
import { CardValidator } from "./card.validator";
import { UserModel } from "../Auth/auth.model";

const cardValidator = new CardValidator

export class CardController {
    public async CreateCard (req: any, res: Response): Promise<Response> {
        try {
            const userId = req.user.id;
            const {name, cardNo, exp, cvv} = req.body 
            const ValidatedBody = await cardValidator.ValidateCardCreation(req.body);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const user = await UserModel.findById(userId)
            if (!user) {
                return res.status(404).json({
                    message: "User Not Found",
                    status: 404
                });
            }
            const cardExists = await Card.findOne({ userId: userId })
            if (!cardExists) {
                const newCard = new Card({ userId, cardNo, cvv, exp, name })
                await newCard.save()
            }
            if (cardExists) {
                const updatedCard = await Card.findOneAndUpdate(
                    userId,
                    { cardNo, cvv, exp, name },
                    { new: true, runValidators: true }
                );
            }

            return res.status(200).json({
                message: "Card Updated",
                status: 200,
            });
        } catch (error) {
            console.error("Error updating Card:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            });
        }
    }
    public async GetAllCards (req: Request, res: Response) {
        try {
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
    public async GetCard (req: any, res: Response) {
        try {
            const userId = req.user.id;
            const card = await Card.findOne({ userId: userId })
            if (!card) {
                return res.status(400).json({
                    message: "User is yet to set default card.",
                    status: 400
                })
            }
            return res.status(200).json({
                message: "Card Fetched Successfully!",
                card,
                status: 200,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
    public async FreezeACard (req: Request, res: Response) {
        try {
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
    public async CheckCardBalance (req: Request, res: Response) {
        try {
            const { cardId } = req.body;
            const card = await Card.findById(cardId)
            if (!card) {
                return res.status(404).json({
                    message: "Cannot Find Card!",
                    status: 404,
                })
            }
            const balance = card.balance
            return res.status(500).json({
                message: "Card Balance Fetched Successfully",
                status: 500,
                balance
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }
}