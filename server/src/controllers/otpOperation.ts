import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/Users";
import Admins from "../models/Admins";
import {sendMail} from "./sendMail";
import { otpInputSchema } from "../validation/otpValidation";

export const resendOTP = async (req: Request, res: Response) => {
  const user: { id: string; role: string; email: string; verified: boolean } =
    req.body.user;

  if (user.verified) {
    res.status(404).json({
      message: `${user.email} is already verified`,
    });
    return;
  }

  try {
    if (!process.env.JWT_OTP_SECRET)
      throw new Error("JWT_OTP_SECRET environment variable is not defined.");

    const new_OTP = Math.floor(100000 + Math.random() * 900000);
    const encrypted_OTP = jwt.sign(
      { OTP: new_OTP },
      process.env.JWT_OTP_SECRET,
      {
        expiresIn: "5m",
      }
    );

    await sendMail(user.email, new_OTP);

    const currentUser = user.role === "admin" ? Admins : Users;
    await currentUser.updateOne(
      { _id: user.id },
      { OTP: encrypted_OTP, $inc: { OTP_Attempt: 1 } }
    );

    res.status(201).json({ message: `OTP resend to ${user.email}` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while resending OTP" });
    console.log(err);
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const isValidOTP = otpInputSchema.safeParse(req.body);

  if (!isValidOTP.success) {
    res.status(400).json({
      message: isValidOTP.error.issues[0].message,
      error: isValidOTP.error,
    });
    return;
  }

  const userEnteredOTP = parseInt(isValidOTP.data.OTP);
  const user: {
    id: string;
    role: string;
    email: string;
    OTP: string;
    verified: boolean;
  } = req.body.user;

  if (user.verified) {
    res.status(404).json({
      message: `${user.email} is already verified`,
    });
    return;
  }

  try {
    if (!process.env.JWT_OTP_SECRET) {
      throw new Error("JWT_OTP_SECRET environment variable is not defined.");
    }

    let OTP_decode;

    try {
      OTP_decode = jwt.verify(user.OTP, process.env.JWT_OTP_SECRET);
      if (typeof OTP_decode === "string") throw new Error("Invalid OTP Type");
    } catch (err) {
      res.status(404).json({ message: "OTP expired, resend new OTP!" });
      return;
    }

    const currentUser = user.role === "admin" ? Admins : Users;

    if (userEnteredOTP === OTP_decode.OTP) {
      await currentUser.updateOne({ _id: user.id }, { verified: true });
      res.status(201).json({ message: "Successfully verified" });
    } else {
      await currentUser.updateOne(
        { _id: user.id },
        { $inc: { incorrectAttempt: 1 } }
      );
      res.status(404).json({ message: "Incorrect OTP" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while OTP verification!" });
    console.log(err);
  }
};
