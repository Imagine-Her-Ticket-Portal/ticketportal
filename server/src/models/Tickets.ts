import mongoose from "mongoose";
import { string } from "zod";

const UserRaised = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const TicketSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  referenceComment: {
    type: String,
    default: null,
  },
  authorName: {
    type: String,
    default: null
  },
  location: {
    type: String,
    required: true,
  },
  dateRaised: {
    type: Date,
    required: true,
  },
  dateResolved: {
    type: String,
    default: null
  },
  status: {
    type: String,
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  deleted: {
    type: Boolean,
    default: false
  },
});

const Tickets = mongoose.model("Ticket", TicketSchema);

export default Tickets;
