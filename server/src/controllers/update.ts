import { Request, Response } from "express";
import Admins from "../models/Admins";
import Users from "../models/Users";
import { updateDetail } from "../validation/update";

const updateProfile = async (req: Request, res: Response) => {
  const user: {
    id: string;
    role: string;
    email: string;
  } = req.body.user;

  const isValidData = updateDetail.safeParse(req.body);

  if (!isValidData.success) {
    return res.status(400).json({
      message: isValidData.error.issues[0].message,
      error: isValidData.error,
    });
  }

  const newData = isValidData.data;
  const verified = user.email === newData.email;

  try {
    await (user.role === "admin" ? Admins : Users).updateOne(
      { _id: user.id },
      {
        name: newData.name,
        email: user.email,
        location: newData.location,
        businessName: newData.businessName,
        verified: verified,
      }
    );

    res.status(200).json({ message: "Successfully updated profile" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error on profile update" });
    console.log(err);
  }
};

export default updateProfile;
