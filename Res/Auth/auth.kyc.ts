import { Response, Request } from "express"

export class AuthKYC {
    public async verifyBVN (req: Request, res: Response) {
        try {
            const { bvn } = req.body
            return res.status(200).json({
                message: 'Internal Server Error!',
                status: 200,
            }) 
        } catch (error) {
            return res.status(500).json({
                message: 'Internal Server Error!',
                status: 500,
                error
            })
        }
    }
}