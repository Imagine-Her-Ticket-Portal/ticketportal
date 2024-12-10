import { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendMail } from "./sendMail";
import Admins from "../models/Admins";
import Tickets from "../models/Tickets";
import { AdminLoginData, AdminSignupData } from "../types/admin";
import {
  adminLoginInputSchema,
  adminSignupInputSchema,
} from "../validation/admin";

const ongoingLoginRequests = new Map();
const ongoingSignupRequests = new Map();

export const handleAdminSignup = async (req: Request, res: Response) => {
  const bodyData: AdminSignupData = req.body;
  //console.log(bodyData)

  const isValidInput = adminSignupInputSchema.safeParse(bodyData);
  //console.log(isValidInput)

  if (!isValidInput.success) {
    res.status(400).json({
      message: isValidInput.error.issues[0].message,
      error: isValidInput.error,
    });
    return;
  }

  const { name, email, password, location, sessionId } = isValidInput.data;

  try {
    ongoingSignupRequests.set(sessionId, true);

    const admin = await Admins.findOne({ email });

    if (admin) {
      res.status(409).json({ message: "Email address is already in use." });
      return;
    }

    if (!process.env.JWT_OTP_SECRET || !process.env.JWT_AUTH_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }

    const OTP = Math.floor(Math.random() * 999999);
    //await sendMail(email, OTP);

    const OTP_token = jwt.sign({ OTP: OTP }, process.env.JWT_OTP_SECRET, {
      expiresIn: "5m",
    });
    const encrypted_Pswd = await bcrypt.hash(password, 11);

    const newAdmin = new Admins({
      name,
      email,
      password: encrypted_Pswd,
      location,
      OTP: OTP_token,
      OTP_Attempt: 1,
    });
    await newAdmin.save();

    if(ongoingSignupRequests.get(sessionId)){
      const token = jwt.sign(
        { id: newAdmin._id, role: "admin" },
        process.env.JWT_AUTH_SECRET,
        {
          expiresIn: "1h",
        }
      );
      
      // Generate a refresh token
      const refreshToken = jwt.sign(
        { id: newAdmin._id, role: "admin" },
        process.env.JWT_REFRESH_SECRET!,
        {
          expiresIn: "7d", // Adjust the duration as needed
        }
      );
      
      newAdmin.refreshToken = refreshToken; // Add refresh token to the admin document
      await newAdmin.save();

      res.status(201).json({ message: "Signed successfully", authToken: token });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error during admin signup" });
    console.log(err);
  } finally {
    ongoingSignupRequests.delete(sessionId)
  }
};


export const handleAdminLogin = async (req: Request, res: Response) => {
  const bodyData: AdminLoginData = req.body;

  const isValidInput = adminLoginInputSchema.safeParse(bodyData);

  if (!isValidInput.success) {
    res.status(400).json({
      message: isValidInput.error.issues[0].message,
      error: isValidInput.error,
    });
    return;
  }

  const { email, password, sessionId } = isValidInput.data;

  try {
    ongoingLoginRequests.set(sessionId, true);

    const admin = await Admins.findOne({ email });

    if (!admin) {
      // Admin does not exist
      res.status(404).json({ message: `Admin with email ${email} does not exist.` });
      return;
    }

    // Default deleted to false if it's undefined
    const isDeleted = admin.deleted === true ? true : false;

    if (isDeleted) {
      // Admin has been deleted (soft deleted)
      res.status(404).json({ message: `Admin with email ${email} has been deleted.` });
      return;
    }

    if (admin.banned) {
      res.status(403).json({ message: `Admin ${email} is banned.` });
      return;
    }

    const isValidPswd = await bcrypt.compare(password, admin.password);

    if (!isValidPswd) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    if (!process.env.JWT_AUTH_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT_AUTH_SECRET environment variable is not defined.");
    }

    if(ongoingLoginRequests.get(sessionId)){
      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_AUTH_SECRET,
        {
          expiresIn: "1h",
        }
      );
      
      // Check if the admin already has a refresh token, if not generate one
      if (!admin.refreshToken) {
        const refreshToken = jwt.sign(
          { id: admin._id, role: "admin" },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: "7d", // Adjust the duration as needed
          }
        );

        admin.refreshToken = refreshToken; // Save refresh token in admin document
        await admin.save();
      }
      res.status(200).json({ message: "Logged in successfully", authToken: token });
    } else {
      res.status(400).json({ message: "Login process canceled" });
    }

  } catch (err) {
    res.status(500).json({ message: "Internal server error during admin login" });
    console.error(err);
  } finally {
    ongoingLoginRequests.delete(sessionId)
  }
};

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
    const user = await Admins.findOne({ refreshToken });

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
        { id: user._id, role: "admin" },
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





// Soft delete an admin
// export const softDeleteAdmin = async (req: Request, res: Response) => {
//   try {
//     const adminId = req.params.id;
//     await Admins.findByIdAndUpdate(adminId, { deleted: true });
//     // Update all tickets raised by the soft-deleted admin
//     await Tickets.updateMany(
//       { assignedTo: adminId },
//       { $set: { status: "inactive", assignedTo: null } } // Adjust status and clear the 'raisedBy' field
//     );
//     res.status(200).json({ message: "Admin is no longer a part of the program" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete admin.", error });
//   }
// };

// Soft delete an admin
export const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    await Admins.findByIdAndUpdate(adminId, { deleted: true, deletedAt: new Date() });
    await Tickets.updateMany(
      { assignedTo: adminId },
      { $set: { status: "inactive" } }
    );
    res.status(200).json({ message: "Admin is no longer a part of the program." });
  } catch (error) {
    console.error("Error during admin deletion:", error);
    res.status(500).json({ message: "Failed to delete admin.", error });
  }
};


// Function to get all active admins
export const getActiveAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await Admins.find({ deleted: false });
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admins.", error });
  }
};
