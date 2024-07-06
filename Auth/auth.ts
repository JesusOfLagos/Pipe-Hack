import jwt from 'jsonwebtoken';

export class TokenService {
    public async generateAccessToken(payload: any) {
        try {
            return jwt.sign(payload, '', {
                expiresIn: '',
            });
        } catch (error) {
            console.error(error);
            return false
        }
    }

    public async generateRefreshToken(payload: any) {
        try {
            return jwt.sign(payload, '', {
                expiresIn: '',
            });
        } catch (error) {
            console.error(error);
            return false
        }
    }

    public async verifyAccessToken(token: any) {
        try {
            return jwt.verify(token, '');
        } catch (error) {
            console.error(error);
            return false
        }
    }

    public async verifyRefreshToken(token: any) {
        try {
            return jwt.verify(token, '');
        } catch (error) {
            console.error(error);
            return false
        }
    }

    public async generateOTP(): Promise<string> {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            return otp;
        } catch (error) {
            console.error(error);
            return '000000';  // Default fallback OTP in case of error
        }
    }
    
}