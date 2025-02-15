import React, { useState, useEffect } from "react";
import "./ticket_popup.css";
import Reqbox from "../reqbox/Reqbox";
import { useModal } from "../../modalProvider/Modalprovider";
import Pagenavigation from "../pagenavigation/Pagenavigation";

export default function TicketRequestSectionClient() {
  const { user } = useModal();
  const initialStatus = user.role === "client" ? "pending" : "inreview";
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [sortedTickets, setSortedTickets] = useState([]);

  // Filter tickets based on selected status
  useEffect(() => {
    if (user.role === "client") {
      setFilteredTickets(user.ticketRaised.filter(ticket => ticket.status === selectedStatus));
    }
  }, [selectedStatus, user]);

  // Sort tickets by dateRaised
  useEffect(() => {
    const sortedByDateTickets = [...filteredTickets].sort((a, b) => {
      const dateA = new Date(a.dateRaised);
      const dateB = new Date(b.dateRaised);
      if (dateA.getTime() === dateB.getTime()) {
        return b._id.localeCompare(a._id);
      }
      return dateB - dateA;
    });

    setSortedTickets(sortedByDateTickets);
  }, [filteredTickets]);

  // Pagination calculation
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  // Handle tab/status selection
  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Handle pagination click
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-section">
      <div className="tabs-container">
        <span className="ticket-requests-sub-heading">
          <span style={{ color: "black" }}>TICKET</span> REQUESTS
        </span>
        <div className="tabs">
          {user.role === "client" && (
            <button
              className={`tab-buttons ${selectedStatus === "pending" ? "active-button" : ""}`}
              onClick={() => handleStatusClick("pending")}
            >
              Pending
            </button>
          )}
          <button
            className={`tab-buttons ${selectedStatus === "inreview" ? "active-button" : ""}`}
            onClick={() => handleStatusClick("inreview")}
          >
            In Review
          </button>
          <button
            className={`tab-buttons ${selectedStatus === "resolved" ? "active-button" : ""}`}
            onClick={() => handleStatusClick("resolved")}
          >
            Resolved
          </button>
        </div>
      </div>

      {currentTickets.length > 0 ? (
        currentTickets.map((ticket, index) => (
          <Reqbox key={ticket._id} ticket={ticket} onClose={() => null} />
        ))
      ) : (
        <h3 className="center">No {selectedStatus} Tickets</h3>
      )}

      <Pagenavigation
        ticketsPerPage={ticketsPerPage}
        totalTickets={sortedTickets.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
}
