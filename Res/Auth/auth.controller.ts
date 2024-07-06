import { Request, Response } from 'express';
import { AuthService } from './auth.services';
import { AuthValidator } from './auth.validator';
import { UserModel } from './auth.model';
import { Hasher } from '../../Config/bcrypt';
import { TokenService } from '../../Auth/auth';
import { generateSuccessMail, generateVerifyAccountMail } from './auth.template';
import { MailService } from '../Mail/mail.services';
import { analyzeResult, generate } from './ai';

const authService = new AuthService();
const authValidator = new AuthValidator();
const hasher = new Hasher();
const tokenService = new TokenService();
// const elasticMailService = new ElasticMailService();
const mailService = new MailService()

export class AuthController {
    public async AnalyseResultData(req: Request, res: Response) {
        try {
            const { result, party, candidate, state, lga } = req.body;
    
            // Construct data object for analysis
            const dataObject = {
                text: result,
                party,
                candidate,
                state,
                lga
            };
    
            // Stringify data for AI analysis
            const analysedDataAsString = JSON.stringify(dataObject);
    
            // Generate prompt for AI analysis
            const finalPrompt = `Help analyze this result:\n\n` +
                                `Result: ${result}\n` +
                                `Party: ${party}\n` +
                                `Candidate: ${candidate}\n` +
                                `State: ${state}\n` +
                                `LGA: ${lga}`;
    
            // Call AI function to generate insights based on final prompt
            const aiResponse = await generate(finalPrompt);
    
            // Handle invalid AI response
            if (!aiResponse) {
                return res.status(400).json({
                    message: "Invalid Data For AI",
                    status: 400
                });
            }
    
            // Return successful response with AI insights
            return res.status(200).json({
                message: "Data Analyzed Successfully",
                status: 200,
                data: aiResponse
            });
        } catch (error) {
            // Handle internal server error
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
                error: error
            });
        }
    }

    public async AnalyseLocationData(req: Request, res: Response) {
        try {
            const text = req.body.text
            const analysedData = await analyzeResult(text)
            if (!analysedData) {
                return res.status(400).json({
                    message: "Invalid Data",
                    status: 400
                })
            }
            const analysedDataAsString = JSON.stringify(analysedData);
            const final = `Help analyse this location and how to get there with directions: ${analysedDataAsString}`
            const aiResponse = await generate(final)
            if (!aiResponse) {
                return res.status(400).json({
                    message: "Invalid Data For Ai",
                    status: 400
                })
            }
            return res.status(200).json({
                message: "Data Analysed Successfully",
                status: 200,
                data: aiResponse,
                location: analysedData
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }

    public async Register(req: Request, res: Response) {
        try {
            const data = req.body;
            const ValidatedBody = await authValidator.ValidateRegister(data);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { email, password } = req.body;
            const user = await authService.FindUserByEmail(email);
            if (user) {
                return res.status(400).json({
                    message: 'User already exists',
                    status: 400
                })
            }
            const hashedPassword = await hasher.HashData(password);
            const otp = await tokenService.generateOTP();
            const otpExpiresInForUser = Date.now() + 600000; // 10 minutes
            const newUser = new UserModel({
                email: data.email,
                password: hashedPassword,
                firstname: data.firstname,
                lastname: data.lastname,
                role: data.role,
                otp: otp,
                otpExpiresIn: otpExpiresInForUser
            })
            const userData = {
                email: data.email,
                otp: otp
            }
            // const link = `http://localhost:3000/verify-email?email=${email}&otp=${otp}`
            // const message = generateVerifyAccountMail(link)
            const subject = 'Welcome To Retty!'
            const message = `Here is your otp. ${otp}`
            const mailer = await mailService.SendMail(email, subject, message)
            console.log(mailer)
            if (!mailer) {
                return res.status(500).json({
                    message: "Cannot send email!",
                    status: 500
                })
            }
            await newUser.save();
            return res.status(201).json({
                message: 'User registered successfully',
                status: 201,
                data: userData
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }

    public async Login(req: Request, res: Response) {
        try {
            const data = req.body;
            const ValidatedBody = await authValidator.ValidateLogin(data);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { password, email, role } = req.body;
            const user = await UserModel.findOne({ email: email, role: role })
            if (!user) {
                return res.status(400).json({
                    message: 'User not registered',
                    status: 400
                })
            }
            const isMatch = await hasher.CompareHashData(password, user.password);

            if (!isMatch) {
                return res.status(400).json({
                    message: 'Invalid password',
                    status: 400
                })
            }
            // if (!user.isEmailVerified) {
            //     return res.status(400).json({
            //         message: 'Email not verified',
            //         status: 400
            //     })
            // }
            const payload = { id: user._id, email: user.email }
            const token = await tokenService.generateAccessToken(payload);
            if (!token) {
                return res.status(500).json({
                    message: "Cannot generate Token!",
                    status: 500
                })
            }
            const userData = {
                email: user.email
            }
            return res.status(200).json({
                message: 'User logged in successfully',
                status: 200,
                data: {
                    token: token,
                    user: userData
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }

    public async VerifyEmail(req: Request, res: Response) {
        try {
            const data = req.body;
            const ValidatedBody = await authValidator.ValidateVerifyEmail(data);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            // const { link } = req.body
            // const url = new URL(link);

            // // Extract the email and otp from the URL parameters
            // const email = url.searchParams.get('email');
            // const otp = url.searchParams.get('otp');

            const { email, otp } = req.body

            const user = await UserModel.findOne({ email })
            if (!user) {
                return res.status(404).json({
                    message: "Invalid User",
                    status: 404
                })
            }
            if (user?.isEmailVerified === true) {
                return res.status(400).json({
                    message: "Email Is Verified Already!",
                    status: 400
                })
            }
            if (user.otp !== otp) {
                return res.status(400).json({
                    message: "Invalid OTP",
                    status: 400
                })
            }
            const expires = new Date(user.otpExpiresIn)
            const now = new Date()
            if (expires < now) {
                return res.status(400).json({
                    message: "OTP Is Expired",
                    status: 400
                })
            }
            user.isEmailVerified = true
            user.otp = '1'
            user.otpExpiresIn = new Date()
            const message = generateSuccessMail()
            await mailService.SendMail(email, 'Email Verified Successfully!', message)
            await user.save()
            return res.status(200).json({
                message: "Email Verified Successfully!",
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }

    public async ForgotPassword(req: Request, res: Response) {
        try {
            const data = req.body;
            const ValidatedBody = await authValidator.ValidateForgotPassword(data);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { email } = req.body
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                return res.status(404).json({
                    message: "Invalid Email!",
                    status: 404
                })
            }
            const otp = await tokenService.generateOTP()
            user.otp = otp
            user.otpExpiresIn = new Date(Date.now() + 600000) // 10 minutes
            await user.save()
            // Send forgot password email
            return res.status(200).json({
                message: "Email To Reset Password is sent!",
                status: 200,
                data: {
                    otp
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }

    public async VerifyForgotPassword(req: Request, res: Response) {
        try {
            const data = req.body;
            const ValidatedBody = await authValidator.ValidateVerifyEmail(data);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { email, otp } = req.body
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                return res.status(404).json({
                    message: "Invalid Email!",
                    status: 404
                })
            }
            if (user.otp !== otp) {
                return res.status(400).json({
                    message: "Invalid OTP",
                    status: 400
                })
            }
            const expires = new Date(user.otpExpiresIn)
            const now = new Date()
            if (expires < now) {
                return res.status(400).json({
                    message: "OTP Is Expired",
                    status: 400
                })
            }
            user.otp = ''
            user.otpExpiresIn = new Date()
            await user.save()
            return res.status(200).json({
                message: "OTP Verified Successfully",
                status: 200,
                data: {
                    email: user.email
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }

    public async ResetPassword(req: Request, res: Response) {
        try {
            const data = req.body;
            const ValidatedBody = await authValidator.ValidateResetPassword(data);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email })
            if (!user) {
                return res.status(404).json({
                    message: "Invalid Email!",
                    status: 404
                })
            }
            const hashedPassword = await hasher.HashData(password);
            user.password = hashedPassword
            await user.save()
            return res.status(200).json({
                message: "Password Reset Successfully",
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }

    public async ChangePassword(req: any, res: Response) {
        try {
            const userId = req.user.id
            if (!userId) {
                return res.status(400).json({
                    message: "Invalid User",
                    status: 400
                })
            }
            const data = req.body;
            const ValidatedBody = await authValidator.ValidateChangePassword(data);
            if (ValidatedBody.error) {
                return res.status(400).json({
                    message: ValidatedBody.error.details[0].message,
                    status: 400
                })
            }
            const { password, oldPassword } = req.body
            const user = await UserModel.findById(userId)
            if (!user) {
                return res.status(404).json({
                    message: "Invalid User",
                    status: 404
                })
            }
            const isMatch = await hasher.CompareHashData(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Invalid old password',
                    status: 400
                })
            }
            const hashedPassword = await hasher.HashData(password);
            user.password = hashedPassword
            await user.save()
            return res.status(200).json({
                message: "Password Changed Successfully",
                status: 200
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error!",
                status: 500,
                error
            })
        }
    }
}