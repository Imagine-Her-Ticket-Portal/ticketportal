import React, { useState, useEffect } from "react";
import "./AdminTicketHistory.scss";
import Reqbox from "../reqbox/Reqbox";
import { useModal } from "../../modalProvider/Modalprovider";
import Pagenavigation from "../pagenavigation/Pagenavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AdminTicketHistory() {
    const { user } = useModal();
    const initialStatus =
        user.role && user.role === "client" ? "pending" : "inreview";
    const authToken = localStorage.getItem("authorization");
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 5;
    const [getTickets, setGetTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedSortOption, setSelectedSortOption] = useState("");
    const [activeFilters, setActiveFilters] = useState(["All Tickets"]);
    const [adminSpecificTickets, setAdminSpecificTickets] = useState([]);
    const [sortby, setSortBy] = useState(false);

    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                    if (activeFilters.includes("My Tickets")) {
                        setAdminSpecificTickets(data.tickets.filter(ticket => ticket.assignedTo.name === user.name));
                    }
                } else {
                    //const errorData = await response.json();
                    throw new Error(`Failed to fetch tickets: ${data.message}`);
                }
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
        };

        fetchTickets();
    }, [selectedStatus, authToken, user.name, activeFilters]);

    let filteredTickets = [];
    if (user.role === "client") {
        filteredTickets = user.ticketRaised.filter(
            (ticket) => ticket.status === selectedStatus
        );
    } else {
        filteredTickets = getTickets.filter(
            (ticket) => ticket.status === selectedStatus
        );
    }

    const handleStatusClick = (status) => {
        setSelectedStatus(status);
        setSortBy(false);
        setSelectedSortOption("");
    };

    const handleStatusChange = (ticketId, newStatus) => {
        setGetTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
            )
        );
        setSelectedTicket(null);
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
        return sortedByDateTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    };

    const handleReferenceComment = (ticketId, referenceComment) => {
        setGetTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket._id === ticketId ? { ...ticket, referenceComment: referenceComment } : ticket
            )
        );
    };

    const handleDisplayChange = (option) => {
        setSelectedSortOption(option);
        setSortBy(true);
        setActiveFilters([option === "allTickets" ? "All Tickets" : "My Tickets"]);
    };

    const handleAllTickets = () => {
        setActiveFilters(["All Tickets"]);
        setSortBy(true);
    };

    const handleAdminSpecificTickets = () => {
        setActiveFilters(["My Tickets"]);
        setAdminSpecificTickets(getTickets.filter(ticket => ticket.assignedTo.name === user.name));
        setSortBy(true);
    };

    const removeFilter = () => {
        setActiveFilters([]);
        setAdminSpecificTickets([]);
        setSortBy(false);
    };

    return (
        <div className="ticket-history-section">
            <span className="ticket-history-heading">
                <p className="ticket-history-title">Ticket History</p>
            </span>
            <div className="tabs-container">
                <div className="sort-tickets">
                    <p className={`switch-tickets ${(activeFilters[0] === 'All Tickets') && 'active-filter-application'}`} onClick={handleAllTickets}>All Tickets</p>
                    <p className={`switch-tickets ${(activeFilters[0] === 'My Tickets') && 'active-filter-application'}`} onClick={handleAdminSpecificTickets}>Admin Tickets</p>
                </div>
                <div className="tabs">
                    {user.role === "client" && (
                        <button className={`tab-buttons ${selectedStatus === "pending" ? "active-button" : ""}`} onClick={() => handleStatusClick("pending")}>Pending</button>
                    )}
                    <button className={`tab-buttons ${selectedStatus === "inreview" ? "active-button" : ""}`} onClick={() => handleStatusClick("inreview")}>Inreview</button>
                    <button className={`tab-buttons ${selectedStatus === "resolved" ? "active-button" : ""}`} onClick={() => handleStatusClick("resolved")}>Resolved</button>
                </div>
            </div>
            {(activeFilters[0] === 'All Tickets' || activeFilters.length === 0) ? (
                filteredTickets.length > 0 ? (
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
                    <h3 className="center">No {selectedStatus} Tickets</h3>
                )
            ) : (
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
            )}
            <Pagenavigation
                ticketsPerPage={ticketsPerPage}
                totalTickets={filteredTickets.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
}
