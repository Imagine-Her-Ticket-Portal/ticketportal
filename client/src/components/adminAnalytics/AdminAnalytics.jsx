import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useModal } from "../../modalProvider/Modalprovider";
import './AdminAnalytics.scss';
import PreviewTickets from '../PreviewTickets/PreviewTickets';
import AdminPreviewAllTickets from '../adminPreviewAllTickets/AdminPreviewAllTickets';
import AdminSpecificPreviewTickets from '../adminSpecificPreviewTickets/AdminSpecificPreviewTickets';

const AdminAnalytics = () => {
    const { user } = useModal();
    const navigate = useNavigate();
    const location = useLocation();
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
    const [getTickets, setGetTickets] = useState([]);
    const [activeFilters, setActiveFilters] = useState(["All Tickets"]);
    const [viewAllTickets, setViewAllTickets] = useState(true)
    const authToken = localStorage.getItem("authorization");

    const handlePendingTickets = () => {
        navigate('/admin');
    };

    const handleOtherTickets = () => {
        navigate('/admin/ticket-history');
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/all-tickets`,
                    {
                        method: "GET",
                        headers:
                        {
                            Authorization: authToken,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    setGetTickets(data.tickets);
                } else {
                    throw new Error(`Failed to fetch tickets: ${data.message}`);
                }
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
        };

        fetchTickets();
    }, [authToken]);

    useEffect(() => {
        if (getTickets.length > 0) {
            handleAllTickets();
        }
    }, [getTickets]);

    const getTicketInfo = (arr, status) => {
        return arr.filter(ticket => ticket.status === status).length;
    }

    const handleAllTickets = () => {
        setActiveFilters(["All Tickets"]);
        setTicketsPresent({
            pending: getTicketInfo(getTickets, 'pending'),
            inreview: getTicketInfo(getTickets, 'inreview'),
            resolved: getTicketInfo(getTickets, 'resolved')
        });
        setViewAllTickets(true)
    };

    const handleAdminSpecificTickets = () => {
        setActiveFilters(["My Tickets"]);
        const filteredTickets = getTickets.filter(ticket =>
            ticket.assignedTo !== null && ticket.assignedTo.name === user.name
        );
        setAdminTicketsPresent({
            pending: getTicketInfo(filteredTickets, 'pending'),
            inreview: getTicketInfo(filteredTickets, 'inreview'),
            resolved: getTicketInfo(filteredTickets, 'resolved')
        });
        setViewAllTickets(false)
    };

    // Extract query parameter
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get('name');
        if (name === 'all-tickets') {
            handleAllTickets();
        } else if (name === 'my-tickets') {
            handleAdminSpecificTickets();
        }
    }, [location.search, getTickets]);

    return (
        <div className='analytics-section'>
            <div className='switch-tabs'>
                <Link to='/admin/analytics/?name=all-tickets'>
                    <p className={`switch-view ${(activeFilters[0] === 'All Tickets') && 'active-filter-application'}`} onClick={handleAllTickets}>All Tickets Statistics</p>
                </Link>
                <Link to='/admin/analytics/?name=my-tickets'>
                    <p className={`switch-view ${(activeFilters[0] === 'My Tickets') && 'active-filter-application'}`} onClick={handleAdminSpecificTickets}>Your Tickets At a Glance</p>
                </Link>
            </div>
            <div className='details-box'>
                {activeFilters[0] === 'All Tickets' ? (
                    <>
                        <div className='status-detail-box box-1' onClick={handlePendingTickets}>
                            <h1>{ticketsPresent.pending}</h1>
                            <p>Pending</p>
                        </div>
                        <div className='status-detail-box box-2' onClick={handleOtherTickets}>
                            <h1>{ticketsPresent.inreview}</h1>
                            <p>In Review</p>
                        </div>
                        <div className='status-detail-box box-2' onClick={handleOtherTickets}>
                            <h1>{ticketsPresent.resolved}</h1>
                            <p>Resolved</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='status-detail-box box-1' onClick={handlePendingTickets}>
                            <h1>{adminTicketsPresent.pending}</h1>
                            <p>Pending</p>
                        </div>
                        <div className='status-detail-box box-2' onClick={handleOtherTickets}>
                            <h1>{adminTicketsPresent.inreview}</h1>
                            <p>In Review</p>
                        </div>
                        <div className='status-detail-box box-2' onClick={handleOtherTickets}>
                            <h1>{adminTicketsPresent.resolved}</h1>
                            <p>Resolved</p>
                        </div>
                    </>
                )}
            </div>
            <div className='tabular-section'>
                {
                    viewAllTickets ? <AdminPreviewAllTickets /> : <AdminSpecificPreviewTickets />
                }
            </div>
        </div>
    );
};

export default AdminAnalytics;
