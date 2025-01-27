import React, { useState, useEffect } from 'react';
import Location from '../location/Location';
import Reqbox from '../reqbox/Reqbox';
import Pagenavigation from '../pagenavigation/Pagenavigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import './AdminHome.scss';
import { useModal } from '../../modalProvider/Modalprovider';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
    const navigate = useNavigate();
    const { user } = useModal();
    const authToken = localStorage.getItem("authorization");
    const [ticketsPresent, setTicketsPresent] = useState({
        pending: 0,
        inreview: 0,
        resolved: 0
    });
    const [adminTicketsPresent, setAdminTicketsPresent] = useState({
        pending: 0,
        inreview: 0,
        resolved: 0
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const [allTickets, setAllTickets] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortedTickets, setSortedTickets] = useState([]);
    const [activeLocationFilter, setActiveLocationFilter] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null); //to close the ticket as soon as the status changes
    const ticketsPerPage = 5;
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePendingTickets = () => {
        navigate('/admin');
    };

    const handleOtherTickets = () => {
        navigate('/admin/ticket-history');
    };

    const updateTicketsPresent = (tickets) => {
        setTicketsPresent({
            pending: getTicketInfo(tickets, 'pending'),
            inreview: getTicketInfo(tickets, 'inreview'),
            resolved: getTicketInfo(tickets, 'resolved')
        });
    };

    const fetchAllTickets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/all-tickets`, {
                method: "GET",
                headers: {
                    Authorization: authToken,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setAllTickets(data.tickets);
                updateTicketsPresent(data.tickets);
            } else {
                throw new Error(`Failed to fetch all tickets: ${data.message}`);
            }
        } catch (err) {
            console.error("Error fetching all tickets:", err);
        }
    };

    const fetchRecentTickets = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/recent`, {
                method: "GET",
                headers: {
                    Authorization: authToken,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setRecentTickets(data.tickets);
                SortByReqdate(data.tickets);
            } else {
                throw new Error(`Failed to fetch recent tickets: ${data.message}`);
            }
        } catch (err) {
            console.error("Error fetching recent tickets:", err);
        }
    };

    useEffect(() => {
        fetchAllTickets();
        fetchRecentTickets();
    }, [authToken]);

    const SortByReqdate = (tickets) => {
        const sortedByDateTickets = [...tickets].sort((a, b) => {
            const dateA = new Date(a.dateRaised);
            const dateB = new Date(b.dateRaised);
            if (dateA.getTime() === dateB.getTime()) {
                // the _id field in the is set in such a way that first few characters record when the ticket was raised
                return b._id.localeCompare(a._id);
            }
            return dateB - dateA;
        });
        setSortedTickets(sortedByDateTickets);
    };

    const filteredTickets = sortedTickets.filter((ticket) => {
        return (!selectedLocation || ticket.raisedBy.location === selectedLocation);
    });

    const handleLocationChange = (location) => {
        setSelectedLocation(location);
        setActiveLocationFilter(location ? [location] : []);
    };

    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const removeLocationFilter = () => {
        setActiveLocationFilter([]);
        setSelectedLocation('');
    };

    const handleStatusChange = (ticketId, newStatus) => {
        setRecentTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
            )
        );
        setSelectedTicket(null);
    };

    const handleReferenceCommentChange = (ticketId, newComment, newAuthorName) => {
        setRecentTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket._id === ticketId ? { ...ticket, referenceComment: newComment, authorName: newAuthorName } : ticket
            )
        );
        setSelectedTicket(null);
    }

    const getTicketInfo = (arr, status) => {
        return arr.filter(ticket => ticket.status === status).length;
    };

    const handleAdminSpecificTickets = () => {
        const filteredTickets = recentTickets.filter(ticket =>
            ticket.assignedTo !== null && ticket.assignedTo.name === user.name
        );
        setAdminTicketsPresent({
            pending: getTicketInfo(filteredTickets, 'pending'),
            inreview: getTicketInfo(filteredTickets, 'inreview'),
            resolved: getTicketInfo(filteredTickets, 'resolved')
        });
    };

    useEffect(() => {
        handleAdminSpecificTickets();
    }, [recentTickets]);

    return (
        <>
            <section className="pending-tickets">
                <h1 className='hello-heading' style={{ color: '#D81F84' }}>Hello, <span style={{ color: '#35363A' }}>Admin!</span></h1>
                <div className='ticket-details-section'>
                    <p className='tickets-heading' style={{ display: 'inline-block' }}>Your tickets at a glance</p>
                    <div className="details-box">
                        <>
                            <div className='box-1 status-detail-box' onClick={handlePendingTickets}>
                                <h1>{ticketsPresent.pending}</h1>
                                <p>Pending</p>
                            </div>
                            <div className='box-2 status-detail-box' onClick={handleOtherTickets}>
                                <h1>{ticketsPresent.inreview}</h1>
                                <p>In Review</p>
                            </div>
                            <div className='box-2 status-detail-box' onClick={handleOtherTickets}>
                                <h1>{ticketsPresent.resolved}</h1>
                                <p>Resolved</p>
                            </div>
                        </>
                    </div>
                </div>
                <div className='pending-tickets-heading' id='pendingTickets'>
                    <p className='tickets-heading'>Pending Tickets</p>
                    <Location onLocationChange={handleLocationChange} />
                </div>
                <div className='location-active-filter'>
                    {
                        activeLocationFilter.map((filter, index) => (
                            <button key={filter} className="active-filter" onClick={() => removeLocationFilter(filter)}>
                                <span style={{ textTransform: 'capitalize', padding: '0.5rem' }}>{filter}</span>
                                <FontAwesomeIcon size="1x" style={{ color: '#D81F84' }} icon={faXmark} />
                            </button>
                        ))
                    }
                </div>
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
                                    onReferenceCommentChange={handleReferenceCommentChange}
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
    );
};

export default AdminHome;
