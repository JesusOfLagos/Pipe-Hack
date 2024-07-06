import { TokenService } from "./auth";

const tokenService = new TokenService();

export class Authenticator {
    public async isLoggedIn(req: any, res: any, next: any) {
        try {
            const token = req.headers['authorization'];
            const tokenWithoutBearer = token.split(' ')[1];
            console.log(token)
            if (!token) {
                return res.status(401).send('Access Denied');
            }
            const verified = await tokenService.verifyAccessToken(tokenWithoutBearer);
            console.log(verified)
            if (!verified) {
                return res.status(403).send('Invalid Token');
            }
            req.user = verified
            next()
        } catch (error) {
            console.log(error)
        }
    }
}