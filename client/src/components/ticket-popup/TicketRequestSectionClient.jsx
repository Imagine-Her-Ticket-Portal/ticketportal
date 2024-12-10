import React, { useState, useEffect } from "react";
import "./ticket_popup.css";
import Reqbox from "../reqbox/Reqbox";
import { useModal } from "../../modalProvider/Modalprovider";
import Pagenavigation from "../pagenavigation/Pagenavigation";
import { useTicket } from "../../context/TicketContext";


export default function TicketRequestSectionClient() {


  const { user } = useModal();
  const initialStatus =
    user.role && user.role === "client" ? "pending" : "inreview";
  const authToken = localStorage.getItem("authorization");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const ticketsPerPage = 5;
  
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    user.role === "client" && window.location.reload()
  }, [])

  // Calculate the index range for the currently displayed tickets
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  let filteredTickets = [];
  //if the user is client
  if (user.role && user.role === "client") {
    filteredTickets = user.ticketRaised.filter(
      (ticket) => ticket.status === selectedStatus
    );
    //console.log('user : ', user)
  }

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusChange = (ticketId, newStatus) => {
    filteredTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    setSelectedTicket(null);
    //alert(`Ticket ID: ${ticketId} status changed to ${newStatus}`);
  };

  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  const displayTicketsByDate = () => {
    const sortedByDateTickets = [...filteredTickets].sort((a, b) => {
      const [yearA, monthA, dayA] = a.dateRaised.split("-").map(Number);
      const [yearB, monthB, dayB] = b.dateRaised.split("-").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      if (dateA.getTime() === dateB.getTime()) {
        // the _id field in the is set in such a way that first few characters record when the ticket was raised
        return b._id.localeCompare(a._id);
    }
      return dateB - dateA;
    });
    const currentTickets = sortedByDateTickets.slice(indexOfFirstTicket, indexOfLastTicket)
    return currentTickets
  };

  return (
    <div className="admin-section">
      <div className="tabs-container">
        <span className="ticket-requests-sub-heading"><span style={{ 'color': 'black' }}>TICKET</span> REQUESTS</span>
        <div className="tabs">
          {
            user.role && user.role === "client" && (
              <button className={`tab-buttons ${selectedStatus === "pending" ? "active-button" : ""}`} onClick={() => handleStatusClick("pending")}>Pending</button>
            )
          }
          <button className={`tab-buttons ${selectedStatus === "inreview" ? "active-button" : ""}`} onClick={() => handleStatusClick("inreview")}>Inreview</button>
          <button className={`tab-buttons ${selectedStatus === "resolved" ? "active-button" : ""}`} onClick={() => handleStatusClick("resolved")}>Resolved</button>
        </div>
      </div>


      
      {filteredTickets.length > 0 ? (
        displayTicketsByDate().map((ticket, index) => (
          <Reqbox key={index} ticket={ticket} onClose={() => setSelectedTicket(null)} onStatusChange={handleStatusChange} /> // Added a key prop for React
        ))
      ) : (
        <h3 className="center">No {selectedStatus} Tickets</h3>
      )}

      <Pagenavigation
        ticketsPerPage={ticketsPerPage}
        totalTickets={filteredTickets.length}
        currentPage={currentPage}
        paginate={paginate}
      />


{/* {loading ? (
        <h3 className="center">Loading Tickets...</h3> // Display loading text when loading is true
      ) : (
        <>
          {filteredTickets.length > 0 ? (
            displayTicketsByDate().map((ticket, index) => (
              <Reqbox
                key={index}
                ticket={ticket}
                onClose={() => setSelectedTicket(null)}
                onStatusChange={handleStatusClick}
              />
            ))
          ) : (
            <h3 className="center">No {selectedStatus} Tickets</h3>
          )}
          <Pagenavigation
            ticketsPerPage={ticketsPerPage}
            totalTickets={filteredTickets.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </>
      )} */}


    </div>
  );
}
