import React from 'react'
import { useState, useEffect } from 'react'
import { useModal } from '../../modalProvider/Modalprovider.jsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faArrowDown, faFileDownload, faArrowRight, faRefresh, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import './PreviewTickets.scss';
import DownloadButton from '../downloadButton/DownloadButton.jsx';
// import { toast } from 'react-toastify';

const reduceLength = (text) => {
    const reducedData = text.split(" ").length > 10
        ? text.split(" ").slice(0, 5).join(" ") + "..."
        : text
    return reducedData
}

const reduceLengthId = (text) => {
    const reducedData = text.length > 10
        ? text.slice(0, 5) + "..."
        : text
    return reducedData
}

const reverseTickets = (tickets) => {
    const reversedTickets = []
    tickets.tickets.forEach(ticket => {
        reversedTickets.unshift(ticket)
    });
    return reversedTickets
}

const formatDate_dd_mm_yyyy = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const TicketsTable = (tickets) => {
    return (
        <div className='table-wrapper'>
            <table className="table table-striped table-hover">
                {/* {console.log(reverseTickets(tickets))} */}
                <thead className='table-light'>
                    <tr key={new Date().getTime()}>
                        <th>S.No</th>
                        <th>id</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Message</th>
                        <th>Location</th>
                        <th>Date Raised</th>
                        <th>Status</th>
                        <th>Reference Comment</th>
                        <th>Date Resolved</th>
                        <th>Raised By Name</th>
                        <th>Raised By Email</th>
                        <th>Assigned To Name</th>
                        <th>Assigned To Email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        reverseTickets(tickets).map((ticket, index) => {
                            return (
                                <tr style={{ width: '100%' }} key={ticket._id}>
                                    <td>{index + 1}</td>
                                    <td>{reduceLengthId(ticket._id)}</td>
                                    <td>{ticket.category}</td>
                                    <td>{ticket.title}</td>
                                    <td>{reduceLength(ticket.message)}</td>
                                    <td>{ticket.location}</td>
                                    <td>{formatDate_dd_mm_yyyy(ticket.dateRaised)}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.referenceComment === null || "" ? "No reference comment has been added yet..." : ticket.referenceComment}</td>
                                    <td>{ticket.dateResolved === null ? 'Not resolved' : formatDate_dd_mm_yyyy(ticket.dateResolved)}</td>
                                    <td>{ticket.raisedBy.name}</td>
                                    <td>{ticket.raisedBy.email}</td>
                                    {
                                        !(ticket.assignedTo) && (
                                            <>
                                                <td>Not Assigned</td>
                                                <td>Not Assigned</td>
                                            </>
                                        )
                                    }
                                    {
                                        ticket.assignedTo && (
                                            <>
                                                <td>{ticket.assignedTo.name === null ? 'Not assigned' : ticket.assignedTo.name}</td>
                                                <td>{ticket.assignedTo.email === null ? 'Not assigned' : ticket.assignedTo.email}</td>
                                            </>
                                        )
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div >
    )
}

const PreviewTickets = () => {
    const [getTickets, setGetTickets] = useState([]);
    const [getSelectedTickets, setGetSelectedTickets] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const { isAuthenticated } = useModal();
    const authToken = localStorage.getItem("authorization")
    const [message, setMessage] = useState('')
    const [allowEndDateChange, setAllowEndDateChange] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/all-tickets`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: authToken,
                        },
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    //console.log(data.tickets)
                    setMessage('Loading...')
                    setGetTickets(data.tickets)
                } else {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch tickets: ${errorData.message}`);
                }
            }
            catch (err) {
                alert(err.message)
                // toast.error(err.message || "An error has occurred")
                console.error("Error fetching tickets:", err);
            }
        }
        fetchTickets()
    }, [authToken])

    useEffect(() => {
        const fetchSelectedTickets = async (startDate, endDate) => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/preview-by-date?startDate=${startDate}&endDate=${endDate}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: authToken,
                            startDate: startDate,
                            endDate: endDate
                        }
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    //console.log(data.tickets)
                    setMessage('Loading...')
                    setGetSelectedTickets(data.tickets)
                }
                else if (response.status === 400) {
                    alert(data.message)
                    // toast(data.message)
                    handleTickets()
                }
                else if (response.status === 404) {
                    //alert(data.message)
                    //console.log(data.message)
                    setGetSelectedTickets([])
                    setMessage(data.message)
                }
                else {
                    //const errorData = await response.json();
                    setMessage(data.message)
                }
            }
            catch (err) {
                if (err.status === 404) {
                    alert('Date not found')
                    // toast("Date not found")
                    handleTickets()
                }
                alert(err.message)
                // toast.error(err.message || "An error has occurred")
                console.error("Error fetching tickets:", err);
            }
        }
        if (startDate && endDate) {
            fetchSelectedTickets(startDate, endDate)
        }
    }, [authToken, startDate, endDate])

    const handleStartDateChange = (event) => {
        const selectedStartDate = event.target.value;
        setStartDate(selectedStartDate);
        if (selectedStartDate) {
            setAllowEndDateChange(true);
        }
    };

    const handleEndDateChange = (event) => {
        if (allowEndDateChange) {
            const selectedEndDate = event.target.value;
            setEndDate(selectedEndDate);
        }
    };

    const handleEndDateClick = () => {
        if (!allowEndDateChange) {
            return;
        }
        setEndDate('');
    };

    const handleEndDate = (e) => {
        e.preventDefault();
        setEndDate(e.target.value);
    }

    const handleTickets = () => {
        setStartDate('')
        setEndDate('')
        setGetSelectedTickets('')
    }

    return (
        <>
            <div className='preview-buttons-container'>
                <div className='analytics-heading'>ALL <span style={{ color: '#D81F84' }}>TICKETS</span></div>
                <div className='date-container'>
                    <div>
                        <FontAwesomeIcon className='icon' size='xl' icon={faCalendarAlt} />
                        <input
                            className='date-box'
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className="icon-container">
                        <FontAwesomeIcon className='icon' size='xl' icon={faArrowRight} />
                    </div>
                    <div>
                        <FontAwesomeIcon className='icon' size='xl' icon={faCalendarAlt} />
                        <input
                            className='date-box'
                            type="date"
                            // value={allowEndDateChange && endDate}
                            // onChange={allowEndDateChange ? handleEndDateChange : handleEndDate}
                            value={endDate}
                            onChange={handleEndDate}
                            disabled={!allowEndDateChange}
                        // onClick={handleEndDateClick}
                        />
                    </div>
                    <div className="icon-container" onClick={handleTickets} style={{ cursor: 'pointer' }}>
                        <FontAwesomeIcon className='icon' size='xl' icon={faRefresh} />
                    </div>
                </div>
                <div className='download-button-container'>
                    <DownloadButton />
                </div>
            </div>
            {
                isAuthenticated && startDate.length > 0 && endDate.length > 0
                    ? (getSelectedTickets.length > 0 ? <TicketsTable tickets={getSelectedTickets} /> : <h3 style={{ margin: '50px', textAlign: 'center' }}>{message}</h3>)
                    : <TicketsTable tickets={getTickets} />
                // ? (<TicketsTable tickets={getSelectedTickets} />)
                // : <TicketsTable tickets={getTickets} />
            }
        </>
    )
}

export default PreviewTickets