import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors'
import { connectToMongoDB } from './database';
import { Cors } from './Config/cors';
import { TestRouter } from './test.router';
import { authRouter } from './Res/Auth/auth.router';

const backCors = new Cors()


const Retty: Express = express();

Retty.use(express.json());
Retty.use(express.urlencoded({ extended: true }));
Retty.use(cors(backCors.corsOptions))

Retty.use('/api/v1/global', TestRouter);
Retty.use('/api/v1/auth', authRouter);

Retty.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({ message: 'This Request does not sit with Retty API' });
})

Retty.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});
connectToMongoDB();
Retty.listen(3000, () => {
    console.log(`Server started on port ${3000}`);
})


