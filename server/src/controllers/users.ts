import { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Users from "../models/Users";
import Tickets from "../models/Tickets";
import { sendMail } from "./sendMail";
import { UserLoginData, UserSignupData } from "../types/user";
import {
  userLoginInputSchema,
  userSignupInputSchema,
} from "../validation/user";

// To keep track of ongoing login requests
const ongoingLoginRequests = new Map();
const ongoingSignupRequests = new Map();

//console.log(ongoingLoginRequests)

export const handleUserSignup = async (req: Request, res: Response) => {
  const bodyData: UserSignupData = req.body;

  const isValidInput = userSignupInputSchema.safeParse(bodyData);

  if (!isValidInput.success) {
    res.status(400).json({
      message: isValidInput.error.issues[0].message,
      error: isValidInput.error,
    });
    return;
  }

  const { name, email, password, location, businessName, sessionId } = isValidInput.data;

  try {
    ongoingSignupRequests.set(sessionId, true);
    
    const user = await Users.findOne({ email });

    if (user) {
      res.status(409).json({ message: "Email address is already in use." });
      return;
    }

    if (!process.env.JWT_OTP_SECRET || !process.env.JWT_AUTH_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    await sendMail(email, OTP);

    const OTP_token = jwt.sign({ OTP: OTP }, process.env.JWT_OTP_SECRET, {
      expiresIn: "5m",
    });
    const encrypted_Pswd = await bcrypt.hash(password, 11);

    const newUser = new Users({
      name,
      email,
      password: encrypted_Pswd,
      location: location,
      businessName: businessName,
      OTP: OTP_token,
      OTP_Attempt: 1,
    });
    await newUser.save();

    if(ongoingSignupRequests.get(sessionId)){
      const token = jwt.sign(
        { id: newUser._id, role: "user" },
        process.env.JWT_AUTH_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Generate a refresh token
      const refreshToken = jwt.sign(
        { id: newUser._id, role: "user" },
        process.env.JWT_REFRESH_SECRET!,
        {
          expiresIn: "7d", // Adjust the duration as needed
        }
      );
      
      newUser.refreshToken = refreshToken; // Add refresh token to the user document
      await newUser.save();

      res.status(201).json({ message: "Signed successfully", authToken: token });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error during user signup" });
    console.log(err);
  } finally {
    ongoingSignupRequests.delete(sessionId)
  }
};

export const handleUserLogin = async (req: Request, res: Response) => {
  const bodyData: UserLoginData = req.body;

  const isValidInput = userLoginInputSchema.safeParse(bodyData);

  if (!isValidInput.success) {
    res.status(400).json({
      message: isValidInput.error.issues[0].message,
      error: isValidInput.error,
    });
    return;
  }

  const { email, password, sessionId } = isValidInput.data; // Include sessionId in the login request

  try {
    // Store the ongoing request
    ongoingLoginRequests.set(sessionId, true);

    const user = await Users.findOne({ email });

    if (!user) {
      res.status(404).json({ message: `User with email ${email} does not exist.` });
      return;
    }

    const isDeleted = user.deleted === true ? true : false;

    if (isDeleted) {
      res.status(404).json({ message: `User with email ${email} has been deleted.` });
      return;
    }

    if (user.banned) {
      res.status(403).json({ message: `User with email ${email} is banned.` });
      return;
    }

    const isValidPswd = await bcrypt.compare(password, user.password);

    if (!isValidPswd) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    if (!process.env.JWT_AUTH_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_AUTH_SECRET environment variable is not defined.");
    }

    // Simulate a delay to test the login process
    //await new Promise((resolve) => setTimeout(resolve, 10000));

    // Check if the request was canceled
    if (ongoingLoginRequests.get(sessionId)) {
      const token = jwt.sign(
        { id: user._id, role: "user" },
        process.env.JWT_AUTH_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Check if the user already has a refresh token, if not generate one
      if (!user.refreshToken) {
        const refreshToken = jwt.sign(
          { id: user._id, role: "user" },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: "7d", // Adjust the duration as needed
          }
        );

        user.refreshToken = refreshToken; // Save refresh token in user document
        await user.save();
      }

      res.status(200).json({ message: "Logged in successfully", authToken: token });
    } else {
      res.status(400).json({ message: "Login process canceled" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error during user login" });
    console.log(err);
  } finally {
    // Clean up the ongoing request
    ongoingLoginRequests.delete(sessionId);
  }
};

// New endpoint to cancel ongoing login request
export const cancelLoginRequest = async (req: Request, res: Response) => {
  const { sessionId } = req.body; // Expect session ID to cancel

  if (ongoingLoginRequests.has(sessionId)) {
    ongoingLoginRequests.delete(sessionId); // Remove the ongoing request
    return res.status(200).json({ message: "Login process canceled" });
  }

  res.status(404).json({ message: "No ongoing login process found for this session." });
};

// New endpoint to handle refresh token
export const handleRefreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }

  try {
    const user = await Users.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token." });
      }

      // If valid, generate a new access token
      const newAccessToken = jwt.sign(
        { id: user._id, role: "user" },
        process.env.JWT_AUTH_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ message: "New access token generated.", authToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error during refresh token:", error);
    res.status(500).json({ message: "Internal server error during refresh token" });
  }
};



// Soft delete a user
// export const softDeleteUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;
//     await Users.findByIdAndUpdate(userId, { deleted: true });
//     // Update all tickets raised by the soft-deleted user
//     await Tickets.updateMany(
//       { raisedBy: userId },
//       { $set: { status: "inactive", raisedBy: null } } // Adjust status and clear the 'raisedBy' field
//     );
//     res.status(200).json({ message: "User is no longer a part of the program." });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete user.", error });
//   }
// };

// Soft delete a user
export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    await Users.findByIdAndUpdate(userId, { deleted: true, deletedAt: new Date() });
    await Tickets.updateMany(
      { raisedBy: userId },
      { $set: { status: "inactive", deleted: true } },
    );
    res.status(200).json({ message: "User is no longer a part of the program." });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({ message: "Failed to delete user.", error });
  }
};
