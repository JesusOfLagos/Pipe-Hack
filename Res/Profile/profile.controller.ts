import { Request, Response } from "express";
import { ProfileValidator } from "./profile.validator";
import { UserProfileModel } from "./profile.model";
import { UserModel } from "../Auth/auth.model";

const profileValidator = new ProfileValidator

export class ProfileController {
    public async EditProfile(req: any, res: Response): Promise<Response> {
        try {
            const userId = req.user.id;
            const { phone, address, city, state, country, zip } = req.body;

            const ValidatedBody = await profileValidator.validateProfileEdit(req.body);
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
            const profileExists = await UserProfileModel.findOne({ userId: userId })
            if (!profileExists) {
                const newProfile = new UserProfileModel({ userId, phone, address, city, state, zip, country })
                await newProfile.save()
            }
            if (profileExists) {
                const updatedUser = await UserProfileModel.findOneAndUpdate(
                    userId,
                    { phone, address, city, state, zip, country },
                    { new: true, runValidators: true }
                );
            }

            return res.status(200).json({
                message: "Profile Updated",
                status: 200,
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            });
        }
    }


    public async ChangeNotificationStatus(req: any, res: Response) {
        try {
            const ValidatedBody = await profileValidator.validateNotificationStatus(req.body);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { mobile, login, desktop, email } = req.body;
            const userId = req.user.id
            const profile = await UserProfileModel.findOne({ userId: userId });
            if (!profile) {
                return res.status(404).json({
                    message: "Profile not found",
                    status: 404
                })
            }
            profile.notifications = { desktop, login, email, mobile }
            await profile.save();
            return res.status(200).json({
                message: "Notification status updated successfully",
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }

    public async ChangeSecurityStatus(req: any, res: Response) {
        try {
            const ValidatedBody = await profileValidator.validateSecurityStatus(req.body);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { mobile, fa, email } = req.body;
            const userId = req.user.id
            const profile = await UserProfileModel.findOne({ userId: userId });
            if (!profile) {
                return res.status(404).json({
                    message: "Profile not found",
                    status: 404
                })
            }
            profile.security = { fa, email, mobile }
            await profile.save();
            return res.status(200).json({
                message: "Verification status updated successfully",
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error
            })
        }
    }

    public async GetProfileDetails(req: any, res: Response) {
        try {
            const userId = req.user.id
            console.log(userId)
            const profile = await UserProfileModel.findOne({ userId: userId });
            if (!profile) {
                return res.status(404).json({
                    message: "Profile not found",
                    status: 404
                })
            }
            return res.status(200).json({
                message: "Notification status updated successfully",
                data: profile,
                status: 200
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
