import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  businessName: {
    type: String,
    default: ''
  },
  ticketRaised: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  OTP: {
    type: String,
    required: true,
  },
  OTP_Attempt: {
    type: Number,
    default: 0,
  },
  incorrectAttempt: {
    type: Number,
    default: 0,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  ticketCount: {
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null, // Null by default, indicating the admin is not deleted
  },
  refreshToken: {
    type: String,
    default: null,
  },
  refreshTokenExpiresAt: {
    type: Date,
    default: null,
  },
});

const Users = mongoose.model("User", UserSchema);

export default Users;
