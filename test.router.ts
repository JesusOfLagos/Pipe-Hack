import { Router } from "express";

export const TestRouter = Router();

TestRouter.get('/', (req, res) => {
    res.json({ message: 'Welcome to Retty API' })
})