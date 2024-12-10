
import { Request, Response } from "express";
import Users from "../models/Users";
import Admins from "../models/Admins";
import Tickets from "../models/Tickets";
import ticketSchema from "../validation/ticket";
import { TicketUpdateMail } from "./sendMail";
import { parseAsync } from "json2csv";

export const getUser = async (req: Request, res: Response) => {
  const user: {
    id: string;
    role: string;
  } = req.body.user;

  try {
    let userData;
    if (user.role === "admin") {
      userData = await Admins.findById(user.id)
        .populate("ticketResolved")
        .populate("ticketInReview");
    } else {
      userData = await Users.findById(user.id)
      .populate({
        path: "ticketRaised",
        populate: { path: "assignedTo", select: "name" } // Populate the assigned admin's name
      });
      
      if (userData) {
        userData = { ...userData.toObject(), role: "client" };
      }
    }
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(userData);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while getting user details" });
    console.log(err);
  }
};














export const raiseTicket = async (req: Request, res: Response) => {
  try {
    const isValidTicket = ticketSchema.safeParse(req.body.ticket);

    function formatDate_dd_mm_yyyy() {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }

    if (!isValidTicket.success) {
      return res.status(400).json({
        message: isValidTicket.error.issues[0].message,
        error: isValidTicket.error,
      });
    }

    const user: {
      id: string;
      name: string;
      email: string;
      location: string;
      count: number;
    } = req.body.user;

    const ticket = {
      ...isValidTicket.data,
      dateRaised: formatDate_dd_mm_yyyy(),
      status: "pending",
      raisedBy: user.id,
      dateResolved: null,
      referenceComment: null
    };

    const newTicket = new Tickets(ticket);
    await newTicket.save();

    await Users.updateOne(
      { _id: user.id },
      { $push: { ticketRaised: newTicket.id }, $inc: { ticketCount: 1 } }
    );
    res.status(201).json({ message: "successfully raised ticket" });
  } catch (err) {
    res.status(400)
      .json({ message: 'This is the error' })
    res
      .status(500)
      .json({ message: "Internal server error while raising Ticket" });
  }
};











// admin specific routes
export const getTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;
  const ticketStatus = req.query.ticketStatus;
  if (!userRole || userRole !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (
    ticketStatus !== "pending" &&
    ticketStatus !== "inreview" &&
    ticketStatus !== "resolved"
  ) {
    return res.status(400).json({ message: "Invalid ticketStatus" });
  }

  try {
    const tickets = await Tickets.find({ status: ticketStatus }).populate(
      "raisedBy"
    ).populate("assignedTo");

    res.json({ tickets });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while fetching tickets" });
    console.log(err);
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  const user = req.body.user;

  if (!user?.role || user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const ticket: { id: string; status: string, dateResolved: string, assignedTo: string | null } = req.body.ticket;
  //This had to be commented inorder to get the ticket switiching between the statuses activated
  // if (ticket.status !== "inreview" && ticket.status !== "resolved") {
  //   return res.status(400).json({ message: "Invalid ticketStatus" });
  // }

  try {
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticket.id,
      {
        $set: {
          status: ticket.status,
          // assignedTo: ticket.status === "pending" ? null : user.id,
          assignedTo: ticket.assignedTo !== null ? user.id : null,
          dateResolved: ticket.status === "resolved" ? ticket.dateResolved : null
        }
      },
      { new: true }
    ).populate("assignedTo");

    if (ticket.status === "resolved") {
      await Admins.updateOne(
        { _id: user.id },
        {
          $push: { ticketResolved: ticket.id },
          $pull: { ticketInReview: ticket.id },
        }
      );
    } else {
      await Admins.updateOne(
        { _id: user.id },
        {
          $push: { ticketInReview: ticket.id },
        }
      );
    }

    const raisedBy = await Users.findById(updatedTicket?.raisedBy, 'email', { new: true });

    if (raisedBy) {
      TicketUpdateMail(ticket.status, raisedBy.email, user.email, user.name);
    } else {
      return res.status(400).json({ message: "Ticket Status updated, email not sent" });;
    }

    res.status(200).json({ message: "Successfully updated ticket status and notified" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while ticket status update" });
    console.log(err);
  }
};

export const updateReferenceComment = async (req: Request, res: Response) => {
  const user = req.body.user;

  if (!user?.role || user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const ticket: { id: string; referenceComment: string } = req.body.ticket;

  try {
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticket.id,
      {
        $set: {
          referenceComment: ticket.referenceComment
        }
      },
      { new: true }
    );
    //console.log("updated ticket: ", updatedTicket)

    res.status(200).json({ message: "Reference Comment has been successfully added" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while updating reference comment" });
    console.log(err);
  }
}

export const editReferenceComment = async (req: Request, res: Response) => {
  const user = req.body.user;

  if (!user?.role || user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const ticket: { id: string; referenceComment: string } = req.body.ticket;

  try {
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticket.id,
      {
        $set: {
          referenceComment: ticket.referenceComment
        }
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      message: "Reference Comment has been successfully modified",
      ticket: updatedTicket
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while updating reference comment" });
    console.log(err);
  }
};

export const getRecentTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;

  if (!userRole || userRole !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const recentTickets = await Tickets.find({ status: "pending" }).limit(25).populate("raisedBy");

    res.status(200).json({ tickets: recentTickets });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while fetching recent tickets" });
    console.log(err);
  }
};

export const downloadAllTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;

  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const tickets = await Tickets.find({}).populate("raisedBy").populate("assignedTo")

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found within the specified date range.' });
    }
    //console.log(tickets)
    // Map tickets to exclude _doc and other Mongoose properties
    const cleanTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const {
          _id,
          category,
          title,
          message,
          dateRaised,
          status,
          referenceComment,
          dateResolved,
          raisedBy,
          assignedTo,
        } = ticket.toJSON();

        //console.log(ticket.toJSON())

        const raisedByUser = raisedBy ? await Users.findById(raisedBy) : null;
        const raisedByName = raisedByUser ? raisedByUser.name : '';
        const raisedByEmail = raisedByUser ? raisedByUser.email : '';

        const assignedToUser = assignedTo ? await Admins.findById(assignedTo) : null;
        const assignedToName = assignedToUser ? assignedToUser.name : '';
        const assignedToEmail = assignedToUser ? assignedToUser.email : '';

        const referenceCommentText = (referenceComment === null || referenceComment === '') ? 'No reference comment has been added yet...' : referenceComment
        const userBusinessName = (raisedByUser?.businessName !== null && raisedByUser?.businessName.length !== 0) ? raisedByUser?.businessName : 'Not Added Yet'
        const userStatus = (status === "inactive") ? ((raisedByUser !== null && raisedByUser.deleted) && "User Deleted") : "User Active"

        const location = raisedByUser&& raisedByUser.location;

        return {
          _id,
          category,
          'Sub category': title,
          message,
          'Location' : location,
          dateRaised,
          'User Status': userStatus,
          'Ticket Status': status,
          referenceCommentText,
          'Date Resolved': dateResolved,
          raisedBy: raisedByName,
          raisedByEmail,
          'Business Name': userBusinessName,
          assignedTo: assignedToName,
          assignedToEmail,
        };
      })
    );

    const csv = await parseAsync(cleanTickets);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=all_tickets.csv`);

    res.send(csv);
  } catch (error) {
    console.error('Error downloading tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const downloadTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;

  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const startDate = String(req.body.startDate);
    const endDate = String(req.body.endDate);
    const searchParams = Array(req.body.searchParams)
    const nestedTickets = req.body.filteredTicketsByParams || [];

    const tickets = nestedTickets.flat();
    
    if (!tickets.length) {
      return res.status(404).json({ message: 'No tickets to export' });
    }

    const cleanTickets = await Promise.all(
      tickets.map(async (ticket:any) => {
        const {
          _id,
          category,
          title,
          message,
          dateRaised,
          status,
          referenceComment,
          raisedBy,
          assignedTo,
        } = ticket;

        const raisedByUser = raisedBy ? await Users.findById(raisedBy) : null;
        const assignedToUser = assignedTo ? await Admins.findById(assignedTo) : null;

        return {
          _id,
          category,
          'Sub category': title,
          message,
          dateRaised,
          status,
          referenceComment: referenceComment || 'No reference comment has been added yet...',
          raisedByName: raisedByUser?.name || '',
          raisedByEmail: raisedByUser?.email || '',
          userBusinessName: raisedByUser?.businessName || 'Not Added Yet',
          assignedToName: assignedToUser?.name || '',
          assignedToEmail: assignedToUser?.email || '',
        };
      })
    );

    const csv = await parseAsync(cleanTickets);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=tickets_${startDate !== null && startDate}_${endDate !== null && endDate}.csv`);

    res.send(csv);
  } catch (error) {
    console.error('Error downloading tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const adminSpecificDownloadTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;
  const adminName = req.body.user.name;
  const adminId = req.body.user.id;

  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const startDate = String(req.body.startDate)
    const endDate = String(req.body.endDate)

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both startDate and endDate are required.' });
    }
    const tickets = await Tickets.find({
      assignedTo: adminId,
      dateRaised: { $gte: startDate, $lte: endDate }
    }).populate("raisedBy").populate("assignedTo")

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found within the specified date range.' });
    }

    // Map tickets to exclude _doc and other Mongoose properties
    const cleanTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const {
          _id,
          category,
          title,
          message,
          dateRaised,
          status,
          referenceComment,
          raisedBy,
          assignedTo,
        } = ticket.toJSON();

        const raisedByUser = raisedBy ? await Users.findById(raisedBy) : null;
        const raisedByName = raisedByUser ? raisedByUser.name : '';
        const raisedByEmail = raisedByUser ? raisedByUser.email : '';

        const assignedToUser = assignedTo ? await Admins.findById(assignedTo) : null;
        const assignedToName = assignedToUser ? assignedToUser.name : '';
        const assignedToEmail = assignedToUser ? assignedToUser.email : '';

        const referenceCommentText = (referenceComment === null || referenceComment === '') ? 'No reference comment has been added yet...' : referenceComment
        const userBusinessName = (raisedByUser?.businessName !== null && raisedByUser?.businessName.length !== 0) ? raisedByUser?.businessName : 'Not Added Yet'

        return {
          _id,
          category,
          'Sub category': title,
          message,
          dateRaised,
          status,
          referenceCommentText,
          raisedBy: raisedByName,
          raisedByEmail,
          'Business Name': userBusinessName,
          assignedTo: assignedToName,
          assignedToEmail,
        };
      })
    );

    const csv = await parseAsync(cleanTickets);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=tickets_${startDate}_${endDate}.csv`);

    res.send(csv);
  } catch (error) {
    console.error('Error downloading tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const downloadAllAdminTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;
  const adminName = req.body.user.name;
  const adminId = req.body.user.id;

  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const tickets = await Tickets.find({
      assignedTo: adminId
    }).populate("raisedBy").populate("assignedTo")

    // Map tickets to exclude _doc and other Mongoose properties
    const cleanTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const {
          _id,
          category,
          title,
          message,
          dateRaised,
          status,
          referenceComment,
          raisedBy,
          assignedTo,
        } = ticket.toJSON();

        const raisedByUser = raisedBy ? await Users.findById(raisedBy) : null;
        const raisedByName = raisedByUser ? raisedByUser.name : '';
        const raisedByEmail = raisedByUser ? raisedByUser.email : '';

        const assignedToUser = assignedTo ? await Admins.findById(assignedTo) : null;
        const assignedToName = assignedToUser ? assignedToUser.name : '';
        const assignedToEmail = assignedToUser ? assignedToUser.email : '';

        const referenceCommentText = (referenceComment === null || referenceComment === '') ? 'No reference comment has been added yet...' : referenceComment
        const userBusinessName = (raisedByUser?.businessName !== null && raisedByUser?.businessName.length !== 0) ? raisedByUser?.businessName : 'Not Added Yet'

        const location = raisedByUser && raisedByUser.location;

        return {
          _id,
          category,
          'Sub category': title,
          message,
          'Location' : location,
          dateRaised,
          status,
          referenceCommentText,
          raisedBy: raisedByName,
          raisedByEmail,
          'Business Name': userBusinessName,
          assignedTo: assignedToName,
          assignedToEmail,
        };
      })
    );

    const csv = await parseAsync(cleanTickets);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=all_admin_tickets.csv`);

    res.send(csv);
  } catch (error) {
    console.error('Error downloading tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;

  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    //this gets you all the tickets
    const allTickets = await Tickets.find().populate("raisedBy").populate("assignedTo")
    //console.log(tickets)
    res.status(200).json({ tickets: allTickets });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error while fetching tickets" });
    console.log(err);
  }

}

export const getSelectedTickets = async (req: Request, res: Response) => {
  const userRole = req.body.user?.role;
  const startDate = String(req.query.startDate);
  const endDate = String(req.query.endDate);

  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required' });
  }


  try {
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date should be smaller than End date' });
    }

    const selectedTickets = await Tickets.find({
      dateRaised: { $gte: startDate, $lte: endDate },
    }).populate("raisedBy").populate("assignedTo");

    if (selectedTickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found within the specified date range.' });
    }
    res.status(200).json({ tickets: selectedTickets });
  }

  catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ message: "Internal server error while fetching tickets" });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticketID = req.params.ticketID; 

    const ticket = await Tickets.findByIdAndUpdate(ticketID, {
      status: 'inactive',
      deleted: true,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket Deleted Successfully" });
  } catch (error) {
    console.error("Error during ticket deletion:", error);
    console.log(error)
    res.status(500).json({ message: "Failed to delete ticket.", error });
  }
};
