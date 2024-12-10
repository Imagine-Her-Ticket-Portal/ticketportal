import React from 'react'
import { useState, useRef, useEffect } from 'react'
import styled from "styled-components";
import { useModal } from '../../modalProvider/Modalprovider.jsx'
import ModalBox from '../ModalBox/ModalBox.tsx'
import useModalToggle from '../ModalBox/useModalToggle.tsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faFile } from "@fortawesome/free-solid-svg-icons";
import '../downloadButton/DownloadButton.css'
import './PreviewButton.css'

// import { toast } from 'react-toastify';

const ModalContent = styled.div`
  width: 700px;
  flex-shrink: 0;
  border-radius: 16.477px;
  background: #fff;
  box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 8px;
  display: block;
  @media (max-width: 690px) {
    width: 300px;
    padding: 5px;
  }
`;

const TicketsTable = (tickets) => {
    return (
        <div className='table-wrapper'>
            <table className="table table-striped table-hover">
                <thead className='table-light'>
                    <tr key={new Date().getTime()}>
                        <th>S.No</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Message</th>
                        <th>Date Raised</th>
                        <th>Status</th>
                        <th>RaisedBy Name</th>
                        <th>RaisedBy Email</th>
                        <th>AssignedTo Name</th>
                        <th>AssignedTo Email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tickets.tickets.map((ticket, index) => {
                            return (
                                <tr key={ticket._id}>
                                    <td>{index + 1}</td>
                                    <td>{ticket.category}</td>
                                    <td>{ticket.title}</td>
                                    <td>Message</td>
                                    <td>{ticket.dateRaised}</td>
                                    <td>{ticket.status}</td>
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
        </div>
    )
}

const TicketsTableConditions = (tickets) => {
    let ticketsData = tickets.tickets
    if (ticketsData.length < 0) {
        alert('No tickets available')
        // toast.error("No tickets available");
        return;
    }
    else if (ticketsData.length < 5) {
        return <TicketsTable tickets={ticketsData} />
    }
    let filterTickets = ticketsData.slice(0, 5)
    return <TicketsTable tickets={filterTickets} />
}

const PreviewButton = () => {
    const [getTickets, setGetTickets] = useState([]);
    const { isAuthenticated, user } = useModal();
    const authToken = localStorage.getItem("authorization")
    const { isOpen, toggle } = useModalToggle();
    const modalRef = useRef();
    const selectedStatus = !user.role && user.ticketResolved.length === 0 ? 'pending' : 'resolved'

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
                )
                const data = await response.json()
                if (response.ok) {
                    setGetTickets(data.tickets)
                } else {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch tickets: ${errorData.message}`);
                }
            }
            catch (err) {
                console.error("Error fetching tickets:", err);
            }
        }
        fetchTickets()
    }, [authToken, selectedStatus])



    return (
        <>
            {
                isAuthenticated && user.ticketResolved && (
                    <>
                        <div className='download-button' onClick={toggle}>
                            Preview Tickets
                        </div>

                        <ModalBox isOpen={isOpen} toggle={toggle} className='modal-overlay'>
                            <ModalContent ref={modalRef} className='preview-modal-content'>
                                <div className='cancel-icon' onClick={toggle}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </div>
                                <h2 className='download-ticket-heading'><span>Preview Tickets</span></h2>
                                <TicketsTableConditions tickets={getTickets} />
                            </ModalContent>
                        </ModalBox>
                    </>
                )
            }

        </>
    )
}

export default PreviewButton