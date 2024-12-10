import React, { useEffect } from 'react'
import { useState, useRef } from 'react'
import styled from "styled-components";
import { useModal } from '../../modalProvider/Modalprovider'
import ModalBox from '../ModalBox/ModalBox.tsx'
import useModalToggle from '../ModalBox/useModalToggle.tsx'
import './AdminSpecificDownloadButton.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faCircleXmark, faArrowDown, faFileDownload } from "@fortawesome/free-solid-svg-icons";
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


export default function AdminSpecificDownloadButton() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { isAuthenticated, user } = useModal();
    const authToken = localStorage.getItem("authorization")
    const { isOpen, toggle } = useModalToggle();
    const modalRef = useRef();

    const adminSpecificDownloadTickets = async (startDate, endDate) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/admin-tickets-download`,
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
                if (response.status === 404) {
                    alert(errorData.message);
                    // toast.error(errorData.message || "An error occurred!");
                }
                else {
                    alert(errorData.error)
                    // toast.error(errorData.error || "An error occurred!");
                }
            }
        } catch (err) {
            console.error("Error downloading tickets:", err);
        }
    };

    return (
        <>
            {
                isAuthenticated && user.ticketResolved && (
                    <>
                        <button className='download-button' onClick={toggle}>Download Admin Tickets</button>
                        <ModalBox isOpen={isOpen} toggle={toggle} className='modal-overlay'>
                            <ModalContent ref={modalRef}>
                                <div className='cancel-icon' onClick={toggle}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </div>
                                <h2 className='download-ticket-heading'><span>Download Admin Tickets</span></h2>
                                <div className='date-selector-container'>
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
                                <div className='download-button' onClick={() => adminSpecificDownloadTickets(startDate, endDate)}>
                                    <FontAwesomeIcon style={{ padding: '0 10px' }} size='xl' icon={faFileDownload} />
                                    Download Tickets
                                </div>
                            </ModalContent>
                        </ModalBox>
                    </>
                )
            }

        </>
    )
}