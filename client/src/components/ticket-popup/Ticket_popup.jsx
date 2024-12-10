import React, { useState, useEffect } from "react";
import "./ticket_popup.css"
import Reqbox from "../reqbox/Reqbox";
import { useModal } from "../../modalProvider/Modalprovider";
import Pagenavigation from "../pagenavigation/Pagenavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


export default function TicketRequestssection() {
  const { user } = useModal();
  const initialStatus =
    user.role && user.role === "client" ? "pending" : "inreview";
  const authToken = localStorage.getItem("authorization");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;
  const [getTickets, setGetTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedSortOption, setSelectedSortOption] = useState("")
  const [activeFilters, setActiveFilters] = useState([])
  const [adminSpecificTickets, setAdminSpecificTickets] = useState([]);
  const [sortby, setSortBy] = useState(false);
  // Calculate the index range for the currently displayed tickets
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  //instead of feeding on user.ticket information, let's try to get the ticket information from the db itself
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/all?ticketStatus=${selectedStatus}`,
          {
            method: "GET",
            headers: {
              Authorization: authToken,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setGetTickets(data.tickets);
        } else {
          const errorData = await response.json();
          throw new Error(`Failed to fetch tickets: ${errorData.message}`);
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchTickets();
  }, [selectedStatus, authToken]);
  let filteredTickets = [];
  //if the user is client
  if (user.role && user.role === "client") {
    filteredTickets = user.ticketRaised.filter(
      (ticket) => ticket.status === selectedStatus
    );
    // console.log(filteredTickets)
  }
  //if the user is admin
  else if (user.ticketResolved) {
    if (selectedStatus === "inreview") {
      filteredTickets = getTickets.filter(
        (ticket) => ticket.status === selectedStatus
      );
    } else if (selectedStatus === "resolved")
      filteredTickets = getTickets.filter(
        (ticket) => ticket.status === selectedStatus
      );
  }
  // console.log("resolved : ", user.ticketResolved)
  // console.log("Review", user.tickerInReview)
  const handleStatusClick = (status) => {
    setSelectedStatus(status)
    setSortBy(false);
    setSelectedSortOption("");
    setActiveFilters([])
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setGetTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    setActiveFilters([])
    setSelectedTicket(null);
    //alert(`Ticket ID: ${ticketId} status changed to ${newStatus}`);
  };

  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  const displayTicketsByDate = (tickets) => {
    const sortedByDateTickets = [...tickets].sort((a, b) => {
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

  const handleReferenceComment = (ticketId, referenceComment) => {
    setGetTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, referenceComment: referenceComment } : ticket
      )
    );
    //setSelectedTicket(null);
  }

  const displayAdminTickets = () => {
    const displayTickets = [...filteredTickets].filter((ticket) => {
      return ticket.assignedTo.name === user.name
    })
    setAdminSpecificTickets(displayTickets)
  }

  const handleDisplayChange = (option) => {
    setSelectedSortOption(option)
    switch (option) {
      case 'allTickets':
        setActiveFilters(["All Tickets"])
        setSortBy(true)
        break;
      case 'myTickets':
        setActiveFilters(["My Tickets"])
        displayAdminTickets()
        setSortBy(true)
        break;
      default:
        break;
    }
    setSelectedSortOption("")
  }

  const removeFilter = (filter) => {
    setActiveFilters([])
    if (adminSpecificTickets.length > 0) {
      setAdminSpecificTickets([])
    }
    setSortBy(false)
  };

  return (
    <div className="admin_section">
      <div className="tabs-container">
        <span className="tabs-sub-heading"><span style={{ 'color': 'black' }}>TICKET</span> REQUESTS</span>
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
      <div className="display-tickets-tabs-container">
        <div className="select-dropdown">
          <select
            name="filterDropdown"
            //value={selectedSortOption}
            value={sortby}
            onChange={(e) => handleDisplayChange(e.target.value)}
          >
            <option value='' hidden>Sort By</option>
            {/* <option value="remove">Remove Filter</option> */}
            <option value='allTickets'>All Tickets</option>
            <option value="myTickets">My Tickets</option>
          </select>
          <div className="active-filter-container">
            {
              activeFilters.map((filter, index) => (
                <button key={filter} className="active-filter" onClick={() => removeFilter(filter)}>
                  <span style={{ textTransform: 'capitalize', padding: '0.5rem' }}>{filter}</span>
                  <FontAwesomeIcon size="1x" style={{ color: '#D81F84' }} icon={faXmark} />
                </button>
              ))
            }
          </div>
        </div>
      </div>
      {
        //all tickets
        activeFilters[0] === 'All Tickets' || activeFilters.length === 0
          ?
          (filteredTickets.length > 0) ? (
            displayTicketsByDate(filteredTickets).map((ticket, index) => (
              <Reqbox
                key={index}
                ticket={ticket}
                onClose={() => setSelectedTicket(null)}
                onStatusChange={handleStatusChange}
                onReferenceCommentChange={handleReferenceComment}
              />
            ))
          ) : (
            activeFilters.length === 0 && <h3 className="center">No {selectedStatus} Tickets</h3>
          )
          : (
            adminSpecificTickets.length > 0 ? (
              displayTicketsByDate(adminSpecificTickets).map((ticket, index) => (
                <Reqbox
                  key={index}
                  ticket={ticket}
                  onClose={() => setSelectedTicket(null)}
                  onStatusChange={handleStatusChange}
                  onReferenceCommentChange={handleReferenceComment}
                />
              ))
            ) : (
              <h3>No admin specific tickets are found.</h3>
            )
          )
      }
      <Pagenavigation
        ticketsPerPage={ticketsPerPage}
        totalTickets={filteredTickets.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
}
