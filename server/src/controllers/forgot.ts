import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Users from "../models/Users";
import {sendMail} from "./sendMail";
import validateEmail from "../validation/email";
import Admins from "../models/Admins";
import { otpInputSchema } from "../validation/otpValidation";
import bcrypt from "bcrypt";

console.log("Email:", process.env.NODEMAILER_USER_EMAIL)
console.log("password:", process.env.NODEMAILER_APP_PASSWORD)

export const handleForgotPassword = async (req: Request, res: Response) => {
  const isValidEmail = validateEmail.safeParse(req.body);

  if (!isValidEmail.success) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const email = isValidEmail.data.email;
  const role = email.endsWith("@i-her.org") ? "admin" : "user";

  try {
    let user;

    if (role === "admin") user = await Admins.findOne({ email });
    else user = await Users.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    const OTP_token = jwt.sign({ OTP: OTP }, process.env.JWT_OTP_SECRET!, {
      expiresIn: "5m",
    });

    await (role === "admin" ? Admins : Users).updateOne(
      { _id: user._id },
      { OTP: OTP_token, $inc: { OTP_Attempt: 1 } }
    );
    await sendMail(email, OTP);

    const token = jwt.sign(
      { id: user.id, role: role },
      process.env.JWT_AUTH_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ message: "successfully send new OTP", authToken: token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error on forgot password", error:err });
    console.log(err);
  }
};

export const setNewPassword = async (req: Request, res: Response) => {
  const isValidOTP = otpInputSchema.safeParse(req.body);

  if (!isValidOTP.success) {
    return res.status(400).json({
      message: isValidOTP.error.issues[0].message,
      error: isValidOTP.error,
    });
  }

  const newPassword = req.body.newPassword;

  if (
    typeof newPassword !== "string" ||
    newPassword.length < 8 ||
    newPassword.length > 200
  ) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const userData: {
    id: string;
    role: string;
  } = req.body.user;

  const userEnteredOTP = parseInt(isValidOTP.data.OTP);

  try {
    let user;

    if (userData.role === "admin") {
      user = await Admins.findOne({ _id: userData.id });
    } else {
      user = await Users.findOne({ _id: userData.id });
    }

    if (!user) {
      return res.status(403).json({ message: "User not found!" });
    }

    let OTP_decode;

    try {
      OTP_decode = jwt.verify(user.OTP, process.env.JWT_OTP_SECRET!);
      if (typeof OTP_decode === "string") throw new Error("Invalid OTP Type");
    } catch (err) {
      res.status(404).json({ message: "OTP expired, resend new OTP!" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 11);

    if (userEnteredOTP === OTP_decode.OTP) {
      await (userData.role === "admin" ? Admins : Users).updateOne(
        { _id: user.id },
        { password: hashedPassword }
      );
      res.status(200).json({ message: "Successfully updated password" });
    } else {
      await (userData.role === "admin" ? Admins : Users).updateOne(
        { _id: user.id },
        { $inc: { incorrectAttempt: 1 } }
      );
      res.status(404).json({ message: "Incorrect OTP" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error on forgot password" });
    console.log(err);
  }
};
