import React, { useState, useEffect } from "react";
import "./AdminTicketSection.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import Reqbox from "../reqbox/Reqbox";
import Pagenavigation from "../pagenavigation/Pagenavigation";
import Location from "../location/Location";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { toast } from "react-toastify";


export default function AdminTicketSection(props) {
    const cat = props.cat;
    const ticketName = props.ticketName;
    const { user } = useModal();
    const [getTickets, setGetTickets] = useState([]);
    const authToken = localStorage.getItem("authorization");
    const [selectedStatus, setSelectedStatus] = useState("pending");
    const [selectedSortOption, setSelectedSortOption] = useState("");
    const [sortedTickets, setSortedTickets] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState([]);
    const [activeLocationFilter, setActiveLocationFilter] = useState([]);
    const [sortby, setSortBy] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const ticketsPerPage = 5;

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
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

    const applyFilters = () => {
        let filtered = getTickets;

        if (selectedStatus) {
            filtered = filtered.filter(ticket => ticket.status === selectedStatus);
        }

        if (cat) {
            filtered = filtered.filter(ticket => ticket.category === cat.toUpperCase());
        }

        if (ticketName) {
            filtered = filtered.filter(ticket => ticket.title === ticketName.toUpperCase());
        }

        if (selectedLocation) {
            filtered = filtered.filter(ticket => ticket.raisedBy.location === selectedLocation);
        }

        if (activeFilters.includes("My Tickets")) {
            filtered = filtered.filter(ticket => ticket.assignedTo.name === user.name);
        }

        return filtered;
    };

    useEffect(() => {
        const filtered = applyFilters();
        if (selectedSortOption === "date") {
            setSortedTickets(filtered.sort((a, b) => new Date(b.dateRaised) - new Date(a.dateRaised)));
        } else if (selectedSortOption === "dateAsc") {
            setSortedTickets(filtered.sort((a, b) => new Date(a.dateRaised) - new Date(b.dateRaised)));
        } else if (selectedSortOption === "frequency") {
            setSortedTickets(filtered.sort((a, b) => b.raisedBy.ticketCount - a.raisedBy.ticketCount));
        } else {
            setSortedTickets(filtered);
        }
    }, [getTickets, selectedStatus, selectedSortOption, selectedLocation, activeFilters]);

    const removeFilter = (filter) => {
        setActiveFilters(activeFilters.filter(item => item !== filter));
        if (filter === "date" || filter === "date Ascending" || filter === "frequency" || filter === "My Tickets") {
            setSortBy(false);
        }
    };

    const removeLocationFilter = () => {
        setActiveLocationFilter([]);
        setSelectedLocation("");
    };

    const handleSortChange = (option) => {
        setSelectedSortOption(option);
        if (option === "myTickets") {
            if (selectedStatus !== "pending") {
                setActiveFilters([...activeFilters, "My Tickets"]);
            } else {
                alert("No Admin has been assigned yet.");
                // toast("No Admin has been assigned yet.")
            }
        }
    };

    const handlePending = () => {
        setSelectedStatus("pending");
        setSortBy(false);
        setSelectedSortOption("");
    };

    const handleInreview = () => {
        setSelectedStatus("inreview");
        setSortBy(false);
        setSelectedSortOption("");
    };

    const handleResolved = () => {
        setSelectedStatus("resolved");
        setSortBy(false);
        setSelectedSortOption("");
    };

    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        setActiveLocationFilter(location ? [location] : []);
    };

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
    };

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
                            <button className={`tab-buttons ${selectedStatus === "pending" ? "active-button" : ""}`} onClick={handlePending}>Pending</button>
                            <button className={`tab-buttons ${selectedStatus === "inreview" ? "active-button" : ""}`} onClick={handleInreview}>Inreview</button>
                            <button className={`tab-buttons ${selectedStatus === "resolved" ? "active-button" : ""}`} onClick={handleResolved}>Resolved</button>
                        </div>
                    </div>
                    <Location onLocationChange={handleLocationChange} />
                    <div className="tabs-container">
                        <div className="select-dropdown">
                            <select
                                name="filterDropdown"
                                value={selectedSortOption}
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value='' hidden>Sort By</option>
                                <option value="date">Date : Latest to Oldest</option>
                                <option value="dateAsc">Date : Oldest to Latest</option>
                                <option value="myTickets">My Tickets</option>
                                <option value="frequency">Frequency</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="active-filter-container">
                    {activeLocationFilter.map((filter) => (
                        <button key={filter} className="active-filter" onClick={removeLocationFilter}>
                            <span style={{ textTransform: 'capitalize', padding: '0.5rem' }}>{filter}</span>
                            <FontAwesomeIcon size="1x" style={{ color: '#D81F84' }} icon={faXmark} />
                        </button>
                    ))}
                    {activeFilters.map((filter) => (
                        <button key={filter} className="active-filter" onClick={() => removeFilter(filter)}>
                            <span style={{ textTransform: 'capitalize', padding: '0.5rem' }}>{filter}</span>
                            <FontAwesomeIcon size="1x" style={{ color: '#D81F84' }} icon={faXmark} />
                        </button>
                    ))}
                </div>
                <div className="ticket-Box">
                    {loading ? (
                        <p>Loading...</p>
                    ) : sortedTickets.length > 0 ? (
                        sortedTickets.slice(indexOfFirstTicket, indexOfLastTicket).map((ticket, index) => (
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
                    totalTickets={sortedTickets.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </section>
        </div>
    );
}
