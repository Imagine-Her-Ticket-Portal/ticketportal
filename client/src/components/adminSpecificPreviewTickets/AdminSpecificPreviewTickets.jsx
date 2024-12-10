// import React from 'react'
// import { useState, useEffect, useMemo } from 'react'
// import { useModal } from '../../modalProvider/Modalprovider.jsx'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCalendarAlt, faSearch, faArrowDown, faFileDownload, faArrowRight, faRefresh, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import './AdminSpecificPreviewTickets.scss';
// import DownloadButton from '../downloadButton/DownloadButton.jsx';
// import { useLocation } from 'react-router-dom';
// import AdminSpecificDownloadButton from '../adminSpecificDownloadButton/AdminSpecificDownloadButton.jsx';
// import DownloadByParams from '../downloadByParams/DownloadByParams.jsx';
// // import { toast } from 'react-toastify';

// const reduceLength = (text) => {
//     const reducedData = text.split(" ").length > 10
//         ? text.split(" ").slice(0, 5).join(" ") + "..."
//         : text
//     return reducedData
// }

// const reduceLengthId = (text) => {
//     const reducedData = text.length > 10
//         ? text.slice(0, 5) + "..."
//         : text
//     return reducedData
// }

// const reverseTickets = (tickets) => {
//     const reversedTickets = [];
//     tickets.forEach(ticket => {
//         reversedTickets.unshift(ticket);
//     });
//     return reversedTickets;
// };

// const formatDate_dd_mm_yyyy = (inputDate) => {
//     const date = new Date(inputDate);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
// }

// const TicketsTable = ({ tickets, searchParams, setFilteredTicketsByParams }) => {
//     const filteredTickets = useMemo(() => {
//         return reverseTickets(tickets).filter((ticket) => {
//             const searchValue = searchParams.toLowerCase();
//             return (
//                 ticket?.raisedBy?.name?.toLowerCase().includes(searchValue) ||
//                 ticket?.raisedBy?.location?.toLowerCase().includes(searchValue) ||
//                 ticket?.raisedBy?.businessName?.toLowerCase().includes(searchValue) ||
//                 ticket?.status?.toLowerCase().includes(searchValue)
//             );
//         });
//     }, [tickets, searchParams]);

//     useEffect(() => {
//         if (filteredTickets.length > 0) {
//             setFilteredTicketsByParams(filteredTickets);
//         }
//         else{
//             setFilteredTicketsByParams([])
//         }
//     }, [filteredTickets, setFilteredTicketsByParams]);
//     return (
//         <div className='table-wrapper'>
//             {
//                 filteredTickets.length > 0
//                     ? (
//                         <table className="table table-striped table-hover">
//                             <thead className='table-light'>
//                                 <tr key={new Date().getTime()}>
//                                     <th>S.No</th>
//                                     <th>id</th>
//                                     <th>Category</th>
//                                     <th>Sub Category</th>
//                                     <th>Message</th>
//                                     <th>Location</th>
//                                     <th>Date Raised</th>
//                                     <th>User Status</th>
//                                     <th>Ticket Status</th>
//                                     <th>Reference Comment</th>
//                                     <th>Date Resolved</th>
//                                     <th>Raised By Name</th>
//                                     <th>Raised By Email</th>
//                                     <th>Business Name</th>
//                                     <th>Assigned To Name</th>
//                                     <th>Assigned To Email</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {
//                                     filteredTickets.map((ticket, index) => {
//                                         return (
//                                             <tr style={{ width: '100%' }} key={ticket._id}>
//                                                 <td>{index + 1}</td>
//                                                 <td>{reduceLengthId(ticket._id)}</td>
//                                                 <td>{ticket.category}</td>
//                                                 <td>{ticket.title}</td>
//                                                 <td>{reduceLength(ticket.message)}</td>
//                                                 <td>{ticket.location}</td>
//                                                 <td>{formatDate_dd_mm_yyyy(ticket.dateRaised)}</td>
//                                                 <td>
//                                                     {
//                                                         (ticket.status === "inactive") ? ((ticket.raisedBy && ticket.raisedBy.delete) && "User Deleted") : "User Active"
//                                                     }
//                                                 </td>
//                                                 <td>{ticket.status}</td>
//                                                 <td>{(ticket.referenceComment === null || ticket.referenceComment === "") ? "No reference comment has been added yet..." : ticket.referenceComment}</td>
//                                                 <td>{ticket.dateResolved === null ? 'Not resolved' : formatDate_dd_mm_yyyy(ticket.dateResolved)}</td>
//                                                 {
//                                                     (ticket.raisedBy) && (
//                                                         <>
//                                                             <td>{(ticket.raisedBy.name === null || ticket.raisedBy.name === "") ? "No longer part of the program" : ticket.raisedBy.name}</td>
//                                                             <td>{ticket.raisedBy.email}</td>
//                                                             <td>
//                                                                 {
//                                                                     (ticket.raisedBy.businessName !== null && ticket.raisedBy.businessName.length !== 0) ? ticket.raisedBy.businessName : 'Not Added Yet'
//                                                                 }
//                                                             </td>
//                                                         </>
//                                                     )
//                                                 }
//                                                 {
//                                                     !(ticket.raisedBy) && (
//                                                         <>
//                                                             <td>No longer part of the program</td>
//                                                             <td>Details no available</td>
//                                                             <td>Details no available</td>
//                                                         </>
//                                                     )
//                                                 }
//                                                 {
//                                                     !(ticket.assignedTo) && (
//                                                         <>
//                                                             <td>Not Assigned</td>
//                                                             <td>Not Assigned</td>
//                                                         </>
//                                                     )
//                                                 }
//                                                 {
//                                                     ticket.assignedTo && (
//                                                         <>
//                                                             <td>{ticket.assignedTo.name === null ? 'Not assigned' : ticket.assignedTo.name}</td>
//                                                             <td>{ticket.assignedTo.email === null ? 'Not assigned' : ticket.assignedTo.email}</td>
//                                                         </>
//                                                     )
//                                                 }
//                                             </tr>
//                                         )
//                                     })
//                                 }
//                             </tbody>
//                         </table>
//                     )
//                     : <h3 style={{ textAlign: 'center' }}>Tickets Not Available</h3>
//             }
//         </div >
//     )
// }

// const SearchComponent = ({ searchParams, setSearchParams }) => {
//     const handleSearchParamsChange = (e) => {
//         setSearchParams(e.target.value);
//     };
//     return (
//         <div className='search-component'>
//             <div className='row'>
//                 <div className="form-outline col-md-12 col-sm-12">
//                     <input
//                         value={searchParams}
//                         type="search"
//                         id="search-form"
//                         className="form-control search-box"
//                         placeholder="Search By Ticket Status / Client Name / Location / Business Name"
//                         aria-label="Search"
//                         onChange={handleSearchParamsChange}
//                     />
//                 </div>
//                 {/* <div className='col-md-1 col-sm-2 text-center'>
//                     <FontAwesomeIcon className='search-button icon' size='2xl' icon={faSearch} onClick={TicketsTable.filteredTickets} />
//                 </div> */}
//             </div>
//         </div>
//     );
// };

// const AdminSpecificPreviewTickets = () => {
//     const [getTickets, setGetTickets] = useState([]);
//     const [getSelectedTickets, setGetSelectedTickets] = useState([])
//     const [adminTickets, setAdminTickets] = useState([])
//     const [startDate, setStartDate] = useState('')
//     const [endDate, setEndDate] = useState('')
//     const { user, isAuthenticated } = useModal();
//     const authToken = localStorage.getItem("authorization")
//     const [message, setMessage] = useState('')
//     const [allowEndDateChange, setAllowEndDateChange] = useState(false);
//     const location = useLocation()
//     const queryParams = new URLSearchParams(location.search);
//     const name = queryParams.get('name');
//     const [searchParams, setSearchParams] = useState('')
//     const[filteredTicketsByParams, setFilteredTicketsByParams] = useState([])

//     useEffect(() => {
//         const fetchTickets = async () => {
//             try {
//                 const response = await fetch(
//                     `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/all-tickets`,
//                     {
//                         method: "GET",
//                         headers: {
//                             Authorization: authToken,
//                         },
//                     }
//                 )
//                 const data = await response.json()
//                 if (response.ok) {
//                     //console.log(data.tickets)
//                     setMessage('Loading...')
//                     setGetTickets(data.tickets)
//                 } else {
//                     const errorData = await response.json();
//                     throw new Error(`Failed to fetch tickets: ${errorData.message}`);
//                 }
//             }
//             catch (err) {
//                 alert(err.message)
//                 // toast.error(err.message || "An error occurred!");
//                 console.error("Error fetching tickets:", err);
//             }
//         }
//         fetchTickets()
//     }, [authToken])

//     useEffect(() => {
//         const fetchSelectedTickets = async (startDate, endDate) => {
//             try {
//                 const response = await fetch(
//                     `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/preview-by-date?startDate=${startDate}&endDate=${endDate}`,
//                     {
//                         method: 'GET',
//                         headers: {
//                             Authorization: authToken,
//                             startDate: startDate,
//                             endDate: endDate
//                         }
//                     }
//                 )
//                 if (response.status === 404) {
//                     handleTickets()
//                 }
//                 const data = await response.json()
//                 if (response.ok) {
//                     //console.log(data.tickets)
//                     setMessage('Loading...')
//                     //setGetSelectedTickets(data.tickets)
//                     const filteredTickets = data.tickets.filter(ticket =>
//                         ticket.assignedTo !== null && ticket.assignedTo.name === user.name
//                     )
//                     setAdminTickets(filteredTickets)
//                 }
//                 else if (response.status === 400) {
//                     alert(data.message)
//                     // toast.error(data.message || "An error occurred!");
//                     handleTickets()
//                 }
//                 else if (response.status === 404) {
//                     alert(data.message)
//                     // toast.error(data.message || "An error occurred!");
//                     //console.log(data.message)
//                     setGetSelectedTickets([])
//                     setMessage(data.message)
//                     handleTickets()
//                 }
//                 else {
//                     //const errorData = await response.json();
//                     setMessage(data.message)
//                 }
//             }
//             catch (err) {
//                 if (err.status === 404) {
//                     alert('Date not found')
//                     // toast.error("Date not found");
//                     handleTickets()
//                 }
//                 alert(err.message)
//                 // toast.error(err.message || "An error occurred!");
//                 console.error("Error fetching tickets:", err);
//             }
//         }
//         if (startDate && endDate) {
//             fetchSelectedTickets(startDate, endDate)
//         }
//     }, [authToken, startDate, endDate])

//     const handleStartDateChange = (event) => {
//         const selectedStartDate = event.target.value;
//         setStartDate(selectedStartDate);
//         if (selectedStartDate) {
//             setAllowEndDateChange(true);
//         }
//     };

//     const handleEndDateChange = (event) => {
//         if (allowEndDateChange) {
//             const selectedEndDate = event.target.value;
//             setEndDate(selectedEndDate);
//         }
//     };

//     const handleEndDateClick = () => {
//         if (!allowEndDateChange) {
//             return;
//         }
//         setEndDate('');
//     };

//     const handleEndDate = (e) => {
//         e.preventDefault();
//         setEndDate(e.target.value);
//     }

//     const handleTickets = () => {
//         setStartDate('')
//         setEndDate('')
//         setGetSelectedTickets('')
//         handleAdminTickets()
//     }

//     const handleAdminTickets = () => {
//         const filteredTickets = getTickets.filter(ticket =>
//             ticket.assignedTo !== null && ticket.assignedTo.name === user.name
//         );
//         setAdminTickets(filteredTickets)
//     }

//     useEffect(() => {
//         handleAdminTickets()
//     }, [getTickets])

//     return (
//         <>
//             <div className='preview-buttons-container'>
//                 <div className='all-tickets'>
//                     <p style={{ borderBottom: '2px solid #D81F84', paddingBottom: '0.5rem' }} className={`show-all-tickets`}>Admin Tickets</p>
//                 </div>
//                 <div className='date-container'>
//                     <div>
//                         <FontAwesomeIcon className='icon' size='xl' icon={faCalendarAlt} />
//                         <input
//                             className='date-box'
//                             type="date"
//                             value={startDate}
//                             onChange={handleStartDateChange}
//                         />
//                     </div>
//                     <div className="icon-container">
//                         <FontAwesomeIcon className='icon' size='xl' icon={faArrowRight} />
//                     </div>
//                     <div>
//                         <FontAwesomeIcon className='icon' size='xl' icon={faCalendarAlt} />
//                         <input
//                             className='date-box'
//                             type="date"
//                             // value={allowEndDateChange && endDate}
//                             // onChange={allowEndDateChange ? handleEndDateChange : handleEndDate}
//                             value={endDate}
//                             onChange={handleEndDate}
//                             disabled={!allowEndDateChange}
//                         // onClick={handleEndDateClick}
//                         />
//                     </div>
//                     <div className="icon-container" onClick={handleTickets} style={{ cursor: 'pointer' }}>
//                         <FontAwesomeIcon className='icon' size='xl' icon={faRefresh} />
//                     </div>
//                 </div>
//                 <div className='download-button-container'>
//                     {/* <DownloadButton /> */}
//                     {/* <AdminSpecificDownloadButton /> */}
//                     <DownloadByParams searchParams={searchParams} filteredTicketsByParams={filteredTicketsByParams} startDate={startDate} endDate={endDate}/>
//                 </div>
//             </div>
//             <SearchComponent searchParams={searchParams} setSearchParams={setSearchParams} />
//             {
//                 isAuthenticated && startDate.length > 0 && endDate.length > 0
//                     ? (adminTickets.length > 0 ? <TicketsTable searchParams={searchParams} showTickets={name} tickets={adminTickets} setFilteredTicketsByParams={setFilteredTicketsByParams} /> : <h3 style={{ margin: '50px', textAlign: 'center' }}>{message}</h3>)
//                     : <TicketsTable searchParams={searchParams} showTickets={name} tickets={adminTickets} setFilteredTicketsByParams={setFilteredTicketsByParams} />
//                 // ? (<TicketsTable tickets={getSelectedTickets} />)
//                 // : <TicketsTable tickets={getTickets} />
//             }
//         </>
//     )
// }

// export default AdminSpecificPreviewTickets





































import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useModal } from '../../modalProvider/Modalprovider.jsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faSearch, faArrowDown, faFileDownload, faArrowRight, faRefresh, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import './AdminSpecificPreviewTickets.scss';
import DownloadButton from '../downloadButton/DownloadButton.jsx';
import { useLocation } from 'react-router-dom';
import AdminSpecificDownloadButton from '../adminSpecificDownloadButton/AdminSpecificDownloadButton.jsx';
import DownloadByParams from '../downloadByParams/DownloadByParams.jsx';


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
    const reversedTickets = [];
    tickets.forEach(ticket => {
        reversedTickets.unshift(ticket);
    });
    return reversedTickets;
};

const formatDate_dd_mm_yyyy = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const TicketsTable = ({ tickets, searchParams, setFilteredTicketsByParams }) => {
    const filteredTickets = useMemo(() => {
        return reverseTickets(tickets).filter((ticket) => {
            const searchValue = searchParams.toLowerCase();
            return (
                ticket?.raisedBy?.name?.toLowerCase().includes(searchValue) ||
                ticket?.raisedBy?.location?.toLowerCase().includes(searchValue) ||
                ticket?.raisedBy?.businessName?.toLowerCase().includes(searchValue) ||
                ticket?.status?.toLowerCase().includes(searchValue)
            );
        });
    }, [tickets, searchParams]);

    useEffect(() => {
        if (filteredTickets.length > 0) {
            setFilteredTicketsByParams(filteredTickets);
        }
        else{
            setFilteredTicketsByParams([])
        }
    }, [filteredTickets, setFilteredTicketsByParams]);
    return (
        <div className='table-wrapper'>
            {
                filteredTickets.length > 0
                    ? (
                        <table className="table table-striped table-hover">
                            <thead className='table-light'>
                                <tr key={new Date().getTime()}>
                                    <th>S.No</th>
                                    <th>id</th>
                                    <th>Category</th>
                                    <th>Sub Category</th>
                                    <th>Message</th>
                                    <th>Location</th>
                                    <th>Date Raised</th>
                                    <th>User Status</th>
                                    <th>Ticket Status</th>
                                    <th>Reference Comment</th>
                                    <th>Date Resolved</th>
                                    <th>Raised By Name</th>
                                    <th>Raised By Email</th>
                                    <th>Business Name</th>
                                    <th>Assigned To Name</th>
                                    <th>Assigned To Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredTickets.map((ticket, index) => {
                                        return (
                                            <tr style={{ width: '100%' }} key={ticket._id}>
                                                <td>{index + 1}</td>
                                                <td>{reduceLengthId(ticket._id)}</td>
                                                <td>{ticket.category}</td>
                                                <td>{ticket.title}</td>
                                                <td>{reduceLength(ticket.message)}</td>
                                                <td>{ticket.location}</td>
                                                <td>{formatDate_dd_mm_yyyy(ticket.dateRaised)}</td>
                                                <td>
                                                    {
                                                        (ticket.status === "inactive") ? ((ticket.raisedBy && ticket.raisedBy.delete) && "User Deleted") : "User Active"
                                                    }
                                                </td>
                                                <td>{ticket.status}</td>
                                                <td>{(ticket.referenceComment === null || ticket.referenceComment === "") ? "No reference comment has been added yet..." : ticket.referenceComment}</td>
                                                <td>{ticket.dateResolved === null ? 'Not resolved' : formatDate_dd_mm_yyyy(ticket.dateResolved)}</td>
                                                {
                                                    (ticket.raisedBy) && (
                                                        <>
                                                            <td>{(ticket.raisedBy.name === null || ticket.raisedBy.name === "") ? "No longer part of the program" : ticket.raisedBy.name}</td>
                                                            <td>{ticket.raisedBy.email}</td>
                                                            <td>
                                                                {
                                                                    (ticket.raisedBy.businessName !== null && ticket.raisedBy.businessName.length !== 0) ? ticket.raisedBy.businessName : 'Not Added Yet'
                                                                }
                                                            </td>
                                                        </>
                                                    )
                                                }
                                                {
                                                    !(ticket.raisedBy) && (
                                                        <>
                                                            <td>No longer part of the program</td>
                                                            <td>Details no available</td>
                                                            <td>Details no available</td>
                                                        </>
                                                    )
                                                }
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
                    )
                    : <h3 style={{ textAlign: 'center' }}>Tickets Not Available</h3>
            }
        </div >
    )
}

const SearchComponent = ({ searchParams, setSearchParams }) => {
    const handleSearchParamsChange = (e) => {
        setSearchParams(e.target.value);
    };
    return (
        <div className='search-component'>
            <div className='row'>
                <div className="form-outline col-md-12 col-sm-12">
                    <input
                        value={searchParams}
                        type="search"
                        id="search-form"
                        className="form-control search-box"
                        placeholder="Search By Ticket Status / Client Name / Location / Business Name"
                        aria-label="Search"
                        onChange={handleSearchParamsChange}
                    />
                </div>
                {/* <div className='col-md-1 col-sm-2 text-center'>
                    <FontAwesomeIcon className='search-button icon' size='2xl' icon={faSearch} onClick={TicketsTable.filteredTickets} />
                </div> */}
            </div>
        </div>
    );
};

const AdminSpecificPreviewTickets = () => {
    const [getTickets, setGetTickets] = useState([]);
    const [getSelectedTickets, setGetSelectedTickets] = useState([])
    const [adminTickets, setAdminTickets] = useState([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const { user, isAuthenticated } = useModal();
    const authToken = localStorage.getItem("authorization")
    const [message, setMessage] = useState('')
    const [allowEndDateChange, setAllowEndDateChange] = useState(false);
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get('name');
    const [searchParams, setSearchParams] = useState('')
    const[filteredTicketsByParams, setFilteredTicketsByParams] = useState([])

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
                if (response.status === 404) {
                    handleTickets()
                }
                const data = await response.json()
                if (response.ok) {
                    //console.log(data.tickets)
                    setMessage('Loading...')
                    //setGetSelectedTickets(data.tickets)
                    const filteredTickets = data.tickets.filter(ticket =>
                        ticket.assignedTo !== null && ticket.assignedTo.name === user.name
                    )
                    setAdminTickets(filteredTickets)
                }
                else if (response.status === 400) {
                    alert(data.message)
                    handleTickets()
                }
                else if (response.status === 404) {
                    alert(data.message)
                    //console.log(data.message)
                    setGetSelectedTickets([])
                    setMessage(data.message)
                    handleTickets()
                }
                else {
                    //const errorData = await response.json();
                    setMessage(data.message)
                }
            }
            catch (err) {
                if (err.status === 404) {
                    alert('Date not found')
                    handleTickets()
                }
                alert(err.message)
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
        handleAdminTickets()
    }

    const handleAdminTickets = () => {
        const filteredTickets = getTickets.filter(ticket =>
            ticket.assignedTo !== null && ticket.assignedTo.name === user.name
        );
        setAdminTickets(filteredTickets)
    }

    useEffect(() => {
        handleAdminTickets()
    }, [getTickets])

    return (
        <>
            <div className='preview-buttons-container'>
                <div className='all-tickets'>
                    <p style={{ borderBottom: '2px solid #D81F84', paddingBottom: '0.5rem' }} className={`show-all-tickets`}>Admin Tickets</p>
                </div>
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
                    {/* <DownloadButton /> */}
                    {/* <AdminSpecificDownloadButton /> */}
                    <DownloadByParams searchParams={searchParams} filteredTicketsByParams={filteredTicketsByParams} startDate={startDate} endDate={endDate}/>
                </div>
            </div>
            <SearchComponent searchParams={searchParams} setSearchParams={setSearchParams} />
            {
                isAuthenticated && startDate.length > 0 && endDate.length > 0
                    ? (adminTickets.length > 0 ? <TicketsTable searchParams={searchParams} showTickets={name} tickets={adminTickets} setFilteredTicketsByParams={setFilteredTicketsByParams} /> : <h3 style={{ margin: '50px', textAlign: 'center' }}>{message}</h3>)
                    : <TicketsTable searchParams={searchParams} showTickets={name} tickets={adminTickets} setFilteredTicketsByParams={setFilteredTicketsByParams} />
                // ? (<TicketsTable tickets={getSelectedTickets} />)
                // : <TicketsTable tickets={getTickets} />
            }
        </>
    )
}

export default AdminSpecificPreviewTickets