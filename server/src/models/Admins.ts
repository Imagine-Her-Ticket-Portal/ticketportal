import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
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
  ticketResolved: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  ticketInReview: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  ],
  location: {
    type: String,
    required: true,
  },
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

const Admins = mongoose.model("Admin", AdminSchema);

export default Admins;
