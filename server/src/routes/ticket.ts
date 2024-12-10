import { Router } from "express";
import {
  adminSpecificDownloadTickets,
  downloadTickets,
  downloadAllTickets,
  getAllTickets,
  getRecentTickets,
  getTickets,
  raiseTicket,
  updateTicketStatus,
  getSelectedTickets,
  updateReferenceComment,
  editReferenceComment,
  downloadAllAdminTickets,
  deleteTicket
} from "../controllers/tickets";

const ticketRouter = Router();

// no need to validate stats each time, as it increase the request on database
// for that add verified & banned status of the user in the token itself

ticketRouter.get("/all", getTickets);

ticketRouter.get("/recent", getRecentTickets);

ticketRouter.put("/update", updateTicketStatus);

ticketRouter.post("/raise", raiseTicket);

ticketRouter.post("/download", downloadTickets);

ticketRouter.post("/admin-tickets-download", adminSpecificDownloadTickets);

ticketRouter.post('/download-all-admin-tickets', downloadAllAdminTickets)

ticketRouter.post('/download-all-tickets', downloadAllTickets)

ticketRouter.get("/all-tickets", getAllTickets);

ticketRouter.get("/preview-by-date", getSelectedTickets);

ticketRouter.put("/reference-comment", updateReferenceComment)

ticketRouter.patch("/edit-comment", editReferenceComment)

ticketRouter.patch('/delete/:ticketID', deleteTicket);


export default ticketRouter;
