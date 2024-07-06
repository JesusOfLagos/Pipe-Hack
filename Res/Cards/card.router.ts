import { Router } from "express";
import { CardController } from "./card.controller";
import { Authenticator } from "../../Auth/authenticator";

export const cardRouter: Router = Router()
const cardController = new CardController
const authenticator = new Authenticator


cardRouter.patch('/edit', authenticator.isLoggedIn, cardController.CreateCard)
cardRouter.get('/get', authenticator.isLoggedIn, cardController.GetCard)

cardRouter.patch('/virtual/create', authenticator.isLoggedIn, cardController.CreateCard)