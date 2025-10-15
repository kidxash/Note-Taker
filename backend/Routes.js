import express from "express";
import UserAuth from "./MiddleWear/userdataAuth.js";
import { register, login, logout, sendVerifyOTP, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from "./Controllers/userController.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', UserAuth, sendVerifyOTP)
authRouter.post('/verify-account', UserAuth,  verifyEmail);
authRouter.get('/is-auth', UserAuth,  isAuthenticated);
authRouter.post('/send-reset-otp',   sendResetOtp);
authRouter.post('/reset-password',   resetPassword);
authRouter.get('/user', UserAuth,  getUserData);





export default authRouter;