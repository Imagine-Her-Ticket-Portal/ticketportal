import React, { useState, useEffect } from "react";
import "./adminsection.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import Reqbox from "../reqbox/Reqbox";
import Pagenavigation from "../pagenavigation/Pagenavigation";
import Location from "../location/Location";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";

export default function Adminsection(props) {
  const cat = props.cat;
  const ticketName = props.ticketName;
  const { user } = useModal()
  const [getTickets, setGetTickets] = useState([]);
  const authToken = localStorage.getItem("authorization");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  // eslint-disable-next-line no-unused-vars
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [sortedTickets, setSortedTickets] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState([])
  const [activeLocationFilter, setActiveLocationFilter] = useState([])
  const [sortby, setSortBy] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null) //to close the ticket as soon as the status changes
  const ticketsPerPage = 5;

  // Calculate the index range for the currently displayed tickets
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

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
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [selectedStatus, authToken]);


  //filter the tickets based on the type of status
  const filteredTickets = getTickets.filter((ticket) => {
    return (
      ticket.status === selectedStatus &&
      ticket.category === cat.toUpperCase() &&
      ticket.title === ticketName.toUpperCase() &&
      (!selectedLocation || ticket.raisedBy.location === selectedLocation)
    );
  });

  //currentTickets displays the the tickets when the sort action is active and in active
  const currentTickets = sortby
    ? sortedTickets.slice(indexOfFirstTicket, indexOfLastTicket)
    : filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  // console.log(activeFilters)

  const sortTicketsByDate = () => {
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
    setSortedTickets(sortedByDateTickets);
  };

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

  const sortTicketsByDateInAsc = () => {
    const sortedByDateTickets = [...filteredTickets].sort((a, b) => {
      const [yearA, monthA, dayA] = a.dateRaised.split("-").map(Number);
      const [yearB, monthB, dayB] = b.dateRaised.split("-").map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA - dateB;
    });
    setSortedTickets(sortedByDateTickets);
  };

  const sortTicketsByFrequency = () => {
    const sortedByFrequencyTickets = [...filteredTickets].sort((a, b) => {
      return b.raisedBy.ticketCount - a.raisedBy.ticketCount;
    });
    setSortedTickets(sortedByFrequencyTickets);
  };

  const displayAdminTickets = () => {
    const displayTickets = [...filteredTickets].filter((ticket) => {
      return ticket.assignedTo.name === user.name
    })
    setSortedTickets(displayTickets)
  }

  const removeFilter = (filter) => {
    // setActiveFilters(activeFilters.filter(item => item !== filter));
    // if (filter === "date") {
    //   setSortBy(false);
    // }
    setActiveFilters([])
    setSortBy(false)
  };

  const removeLocationFilter = () => {
    setActiveLocationFilter([])
    setSelectedLocation("")
  }

  const handleSortChange = (option) => {
    setSelectedSortOption(option);
    switch (option) {
      case "date":
        setActiveFilters(["date"])
        sortTicketsByDate(filteredTickets)
        setSortBy(true)
        break;
      case "dateAsc":
        setActiveFilters(["date Ascending"])
        sortTicketsByDateInAsc(filteredTickets)
        setSortBy(true)
        break;
      case "myTickets":
        if (selectedStatus !== "pending") {
          setActiveFilters(["My Tickets"])
          displayAdminTickets(filteredTickets)
          setSortBy(true)
        }
        else {
          alert("No Admin has been assigned yet.")
          // toast.error("No Admin has been assigned yet");
        }
        break;
      case "frequency":
        setActiveFilters(["frequency"])
        sortTicketsByFrequency();
        setSortBy(true)
        break;
      // case "remove":
      //   setActiveFilters([])
      //   setSortBy(false)
      //   break;
      default:
        break;
    }
    setSelectedSortOption("")
  };

  const handlePending = () => {
    setSelectedStatus("pending");
    setSortBy(false);
    setSelectedSortOption("");
    setSelectedLocation("")
    setActiveFilters([])
    setActiveLocationFilter([])
  };

  const handleInreview = () => {
    setSelectedStatus("inreview");
    setSortBy(false);
    setSelectedSortOption("");
    setSelectedLocation("")
    setActiveFilters([])
    setActiveLocationFilter([])
  };

  const handleResolved = () => {
    setSelectedStatus("resolved");
    setSortBy(false);
    setSelectedSortOption("");
    setSelectedLocation("")
    setActiveFilters([])
    setActiveLocationFilter([])
  };

  const handleLocationChange = (location) => {
    // setSelectedLocation(location);
    // location === '' ? setActiveLocationFilter(['All Tickets']) : setActiveLocationFilter([location])
    setSelectedLocation(location);
    // Reset active filters and sort state when changing location filter
    setActiveFilters([]);
    setActiveLocationFilter(location ? [location] : []);
    setSortBy(false); // Reset sorting state
  };

  //console.log(activeLocationFilter)

  const handleStatusChange = (ticketId, newStatus) => {
    setGetTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
    setSelectedTicket(null);
  };

  const handleReferenceComment = (ticketId, referenceComment) => {
    setGetTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, referenceComment: referenceComment } : ticket
      )
    );
    //setSelectedTicket(null);
  }

  return (
    <div className="main-content">
      <section className="admin_section">
        <div>
          <div className="heading">
            <span className="sub-heading"><span style={{ 'color': 'black' }}>REQUESTS FOR </span>{cat}</span>
          </div>
        </div>
        <div className="buttons-filter-container">
          <div className="tabs-container">
            <div className="tabs">
              <button className={`tab-buttons ${selectedStatus === "pending" ? "active-button" : ""}`} onClick={() => handlePending("pending")}>Pending</button>
              <button className={`tab-buttons ${selectedStatus === "inreview" ? "active-button" : ""}`} onClick={() => handleInreview("inreview")}>Inreview</button>
              <button className={`tab-buttons ${selectedStatus === "resolved" ? "active-button" : ""}`} onClick={() => handleResolved("resolved")}>Resolved</button>
            </div>
          </div>
          <Location onLocationChange={handleLocationChange} />
          <div className="tabs-container">
            <div className="select-dropdown">
              <select
                name="filterDropdown"
                // value={selectedSortOption}
                value={sortby}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value='' hidden>Sort By</option>
                {/* <option value="remove">Remove Filter</option> */}
                <option value="date">Date : Latest to Oldest</option>
                <option value="dateAsc">Date : Oldest to Latest</option>
                <option value="myTickets">My Tickets</option>
                <option value="frequency">Frequency</option>
              </select>
            </div>
          </div>
        </div>
        <div className="active-filter-container">
          {
            activeLocationFilter.map((filter, index) => (
              <button key={filter} className="active-filter" onClick={() => removeLocationFilter(filter)}>
                <span style={{ textTransform: 'capitalize', padding: '0.5rem' }}>{filter}</span>
                <FontAwesomeIcon size="1x" style={{ color: '#D81F84' }} icon={faXmark} />
              </button>
            ))
          }
          {
            activeFilters.map((filter, index) => (
              <button key={filter} className="active-filter" onClick={() => removeFilter(filter)}>
                <span style={{ textTransform: 'capitalize', padding: '0.5rem' }}>{filter}</span>
                <FontAwesomeIcon size="1x" style={{ color: '#D81F84' }} icon={faXmark} />
              </button>
            ))
          }
        </div>
        {/* {console.log(activeFilters)} */}
        <div className="ticket-Box">
          {loading ? (
            <p>Loading...</p>
          ) : sortby ? (
            sortedTickets.length > 0 ? (
              currentTickets.map((ticket, index) => (
                <Reqbox
                  selectedTicket={selectedTicket}
                  key={index}
                  ticket={ticket}
                  onClose={() => setSelectedTicket(null)}
                  onStatusChange={handleStatusChange}
                  onReferenceCommentChange={handleReferenceComment}
                />
              ))
            ) : (
              <h3 className="center">No {selectedStatus} Tickets</h3>
            )
          ) : filteredTickets.length > 0 ? (
            displayTicketsByDate().map((ticket, index) => (
              <Reqbox
                selectedTicket={selectedTicket}
                key={index}
                ticket={ticket}
                onClose={() => setSelectedTicket(null)}
                onStatusChange={handleStatusChange}
                onReferenceCommentChange={handleReferenceComment}
              />
            ))
          ) : (
            <h3 className="center">No {selectedStatus} Tickets</h3>
          )}
        </div>
        <Pagenavigation
          ticketsPerPage={ticketsPerPage}
          totalTickets={sortby ? sortedTickets.length : filteredTickets.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </section >
    </div >
  );
}
