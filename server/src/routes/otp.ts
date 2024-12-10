import { Router } from "express";
import { resendOTP, verifyOTP } from "../controllers/otpOperation";

const otpRouter = Router();

otpRouter.patch("/resend", resendOTP);

otpRouter.patch("/verify", verifyOTP);

export default otpRouter;
