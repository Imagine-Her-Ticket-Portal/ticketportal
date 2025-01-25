import React from 'react'
import { useState, useRef } from 'react'
import styled from "styled-components";
import { useModal } from '../../modalProvider/Modalprovider'
import ModalBox from '../ModalBox/ModalBox.tsx'
import useModalToggle from '../ModalBox/useModalToggle.tsx'
import './AdminModalDownload.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faCircleXmark, faArrowDown, faFileDownload } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

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


export default function AdminModalDownload() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { isAuthenticated, user } = useModal();
    const authToken = localStorage.getItem("authorization")
    const { isOpen, toggle } = useModalToggle();
    const modalRef = useRef();

    const downloadTickets = async (startDate, endDate) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/download`,
                {
                    method: "POST",
                    headers: {
                        Authorization: authToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        startDate: startDate,
                        endDate: endDate,
                    }),
                }
            );
            // Check if the response status is OK (2xx)
            if (response.ok) {
                const blob = await response.blob();
                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `tickets_${startDate}_${endDate}.csv`;
                link.click();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
                // toast.error(errorData.message || "An error occurred!");
            }
        } catch (err) {
            console.error("Error downloading tickets:", err);
        }
    };

    const downloadAllTickets = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/download-all-tickets`,
                {
                    method: "POST",
                    headers: {
                        Authorization: authToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        startDate: startDate,
                        endDate: endDate,
                    }),
                }
            );
            // Check if the response status is OK (2xx)

            if (response.ok) {
                const blob = await response.blob();
                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `all_tickets.csv`;
                link.click();
            } else {
                const errorData = await response.json();
                alert(errorData.error);
                // toast.error(errorData.error || "An error occurred!");
            }
        } catch (err) {
            console.error("Error downloading tickets:", err);
        }
    };

    const downloadAllAdminTickets = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/download-all-admin-tickets`,
                {
                    method: "POST",
                    headers: {
                        Authorization: authToken,
                        "Content-Type": "application/json",
                    },
                    // body: JSON.stringify({
                    //     startDate: startDate,
                    //     endDate: endDate,
                    // }),
                    body: JSON.stringify({
                        startDate: new Date(startDate).toISOString(),
                        endDate: new Date(endDate).toISOString(),
                      }),
                }
            );
            // Check if the response status is OK (2xx)
            if (response.ok) {
                const blob = await response.blob();
                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `all_admin_tickets.csv`;
                link.click();
                // const data = await response.json()
                // console.log(data.tickets)
            } else {
                const errorData = await response.json();
                alert(errorData.error);
                // toast.error(errorData.error || "An error occurred!");
            }
        } catch (err) {
            console.error("Error downloading tickets:", err);
        }
    };

    const downloadTestAdminTickets = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/download-admin-tickets`,
            {
              method: 'GET',
              headers: {
                Authorization: authToken,
              },
            }
          );
      
          if (response.ok) {
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'admin_tickets.csv';
            link.click();
          } else {
            const errorData = await response.json();
            alert(errorData.message);
          }
        } catch (error) {
          console.error('Error downloading tickets:', error);
        }
      };
      

    return (
        <>
            {
                isAuthenticated && user.ticketResolved && (
                    <>
                        {/* <button className='download-button-navbar' onClick={toggle}>
                            <FontAwesomeIcon size='xl' icon={faFileDownload} />
                            Download Data as CSV
                        </button> */}
                        <li className='list-item' onClick={toggle}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 18.132L5.93486 12.0651L7.14686 10.8326L11.1429 14.8286V0H12.8571V14.8286L16.8514 10.8343L18.0651 12.0651L12 18.132ZM2.76857 24C1.98 24 1.32171 23.736 0.793714 23.208C0.264571 22.6789 0 22.02 0 21.2314V17.0777H1.71429V21.2314C1.71429 21.4943 1.824 21.736 2.04343 21.9566C2.264 22.176 2.50571 22.2857 2.76857 22.2857H21.2314C21.4943 22.2857 21.736 22.176 21.9566 21.9566C22.176 21.736 22.2857 21.4943 22.2857 21.2314V17.0777H24V21.2314C24 22.02 23.736 22.6783 23.208 23.2063C22.6789 23.7354 22.02 24 21.2314 24H2.76857Z" fill="white" />
                            </svg>
                            <p className='list-text'>Download</p>
                        </li>
                        <ModalBox isOpen={isOpen} toggle={toggle} className='modal-overlay'>
                            <ModalContent ref={modalRef}>
                                <div className='cancel-icon' onClick={toggle}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </div>
                                <h2 className='download-ticket-heading'><span>Download Tickets</span></h2>
                                {/* <div className='date-selector-container'>
                                    <div>
                                        <FontAwesomeIcon className='icon' size='2xl' icon={faCalendarAlt} />
                                        <input
                                            className='date-box'
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <FontAwesomeIcon className='icon' size='2xl' icon={faArrowDown} />
                                    </div>
                                    <div>
                                        <FontAwesomeIcon className='icon' size='2xl' icon={faCalendarAlt} />
                                        <input
                                            className='date-box'
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='download-button-navbar' onClick={() => downloadTickets(startDate, endDate)}>
                                    <FontAwesomeIcon style={{ padding: '0 10px' }} size='xl' icon={faFileDownload} />
                                    Download Tickets
                                </div> */}
                                <div className='button-container'>
                                    <div className='download-all-tickets-button-navbar' onClick={() => downloadAllTickets()}>
                                        <FontAwesomeIcon style={{ padding: '0 10px' }} size='xl' icon={faFileDownload} />
                                        Download All Tickets
                                    </div>
                                    <div className="divider">
                                        <span>OR</span>
                                    </div>
                                    {/* <div className='download-specific-button-navbar' onClick={() => downloadAllAdminTickets()}>
                                        <FontAwesomeIcon style={{ padding: '0 10px' }} size='xl' icon={faFileDownload} />
                                        Download Your Tickets
                                    </div> */}
                                    <div className='download-specific-button-navbar' onClick={() => downloadTestAdminTickets()}>
                                        <FontAwesomeIcon style={{ padding: '0 10px' }} size='xl' icon={faFileDownload} />
                                        Download Your Test Tickets
                                    </div>
                                </div>
                            </ModalContent>
                        </ModalBox>
                    </>
                )
            }

        </>
    )
}