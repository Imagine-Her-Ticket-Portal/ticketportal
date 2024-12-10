import React, { useState, useEffect } from "react";
import { useTicket } from "../../context/TicketContext";
import { useModal } from "../../modalProvider/Modalprovider";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function TicketSummary() {
  // const { ticketCounts } = useTicket(); 
  const { user } = useModal();
  const { setTicketCounts } = useTicket(); 
  const navigate = useNavigate();
  
  const initialStatus =
  user.role && user.role === "client" ? "pending" : "inreview";
  
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  useEffect(() => {
    user.role === "client" && window.location.reload()
  }, [])

  let filteredTickets = [];
  //if the user is client
  if (user.role && user.role === "client") {
    filteredTickets = user.ticketRaised.filter(
      (ticket) => ticket.status === selectedStatus
    );
    // console.log('user : ', user)
  }


  const ticketCounts = useMemo(() => {
    if (user && user.ticketRaised) {
      const pendingTickets = user.ticketRaised.filter((ticket) => ticket.status === "pending").length;
      const inReviewTickets = user.ticketRaised.filter((ticket) => ticket.status === "inreview").length;
      const resolvedTickets = user.ticketRaised.filter((ticket) => ticket.status === "resolved").length;

      return {
        pending: pendingTickets,
        inReview: inReviewTickets,
        resolved: resolvedTickets,
      };
    }
    return { pending: 0, inReview: 0, resolved: 0 }; 
  }, [user]); // Only recompute when `user` changes

    // Effect to update the global state (context) when ticketCounts change
    useEffect(() => {
      // console.log(user)
      if (ticketCounts) {
        setTicketCounts(ticketCounts);
      }
    }, [ticketCounts, setTicketCounts]);

const navigateToTicketHisitory = () =>{
  navigate("/ticket-history/requests")
}


  return (
    <section className="pending-tickets">

      <div className="ticket-details-section">
        <div className="details-box">
          <>
            <div className="box-1 status-detail-box" onClick={navigateToTicketHisitory}>
              <h1>{ticketCounts.pending}</h1> 
              <p>Pending</p>
            </div>
            <div className="box-2 status-detail-box" onClick={navigateToTicketHisitory}>
              <h1>{ticketCounts.inReview}</h1>
              <p>In Review</p>
            </div>
            <div className="box-2 status-detail-box" onClick={navigateToTicketHisitory}>
              <h1>{ticketCounts.resolved}</h1>
              <p>Resolved</p>
            </div>
          </>
        </div>
      </div>
    </section>
  );
}

export default TicketSummary;













// import React from "react";
// import { useTicket } from "../../context/TicketContext";

// function TicketSummary() {
//   const { ticketCounts } = useTicket(); // Access ticket counts

//   return (
//     <div>
//       <h2>Ticket Summary</h2>
//       <p>Pending: {ticketCounts.pending}</p>
//       <p>In Review: {ticketCounts.inReview}</p>
//       <p>Resolved: {ticketCounts.resolved}</p>
//     </div>
//   );
// }

// export default TicketSummary;
