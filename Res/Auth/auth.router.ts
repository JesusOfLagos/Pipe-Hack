import { Router } from 'express';
import { AuthController } from './auth.controller';
import { Authenticator } from '../../Auth/authenticator';

export const authRouter = Router();
const authController = new AuthController();
const authenticator = new Authenticator();

authRouter.post('/ping', (req, res) => {
    res.send('pong');
});

authRouter.post('/register', authController.Register);
authRouter.post('/login', authController.Login);
authRouter.post('/email/verify', authController.VerifyEmail);
authRouter.post('/forgot/password', authController.ForgotPassword);
authRouter.post('/reset/password', authController.ResetPassword);
authRouter.post('/change/password', authenticator.isLoggedIn, authController.ChangePassword);
authRouter.post('/verify/forgot', authController.VerifyForgotPassword);
authRouter.post('/ai/results', authController.AnalyseResultData);
authRouter.post('/ai/location', authController.AnalyseLocationData);
