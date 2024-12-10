import React, { useState, useEffect } from 'react'
import Location from '../location/Location'
import Reqbox from '../reqbox/Reqbox'
import Pagenavigation from '../pagenavigation/Pagenavigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import './AdminRecentRequests.scss'

export default function AdminRecentRequests() {
    const [getTickets, setGetTickets] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedTickets, setSortedTickets] = useState([]);
    const [activeLocationFilter, setActiveLocationFilter] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null) //to close the ticket as soon as the status changes
    const ticketsPerPage = 5;
    // Calculate the index range for the currently displayed tickets
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const fetchTickets = async () => {
        try {
            const authToken = localStorage.getItem("authorization")
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/recent`,
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

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        // After getTickets is updated, sort the tickets
        SortByReqdate();
    }, [getTickets]);

    const SortByReqdate = () => {
        const sortedByDateTickets = [...getTickets].sort((a, b) => {
            const dateA = new Date(a.dateRaised);
            const dateB = new Date(b.dateRaised);
            if (dateA.getTime() === dateB.getTime()) {
                // the _id field in the is set in such a way that first few characters record when the ticket was raised
                return b._id.localeCompare(a._id);
            }
            return dateB - dateA;
        });
        setSortedTickets(sortedByDateTickets)
    };

    const filteredTickets = sortedTickets.filter((ticket) => {
        return (
            (!selectedLocation || ticket.raisedBy.location === selectedLocation)
        );
    });

    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        setActiveLocationFilter(location ? [location] : []);
    };

    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const removeLocationFilter = () => {
        setActiveLocationFilter([])
        setSelectedLocation('')
    }

    const handleStatusChange = (ticketId, newStatus) => {
        setGetTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
            )
        );
        setSelectedTicket(null);
    };

    return (
        <>
            <section className="admin_section">
                <div className="container">
                    <div className="heading">
                        RECENT REQUESTS
                    </div>
                </div>
                <Location onLocationChange={handleLocationChange} />
                {
                    activeLocationFilter.map((filter, index) => (
                        <button key={filter} className="active-filter" onClick={() => removeLocationFilter(filter)}>
                            <span style={{ textTransform: 'capitalize', padding: '0.5rem' }}>{filter}</span>
                            <FontAwesomeIcon size="1x" style={{ color: '#D81F84' }} icon={faXmark} />
                        </button>
                    ))
                }
                <div className='requests'>
                    {

                        filteredTickets.length > 0 ? (
                            currentTickets.map((ticket, index) => (
                                <Reqbox
                                    selectedTicket={selectedTicket}
                                    key={index}
                                    ticket={ticket}
                                    onClose={() => setSelectedTicket(null)}
                                    onStatusChange={handleStatusChange}
                                />
                            ))
                        ) : (
                            <h3 className="center">No Recent Tickets</h3>
                        )
                    }

                </div>
                <Pagenavigation
                    ticketsPerPage={ticketsPerPage}
                    totalTickets={filteredTickets.length}
                    currentPage={currentPage}
                    paginate={paginate}
                />
            </section>
        </>
    )
}
