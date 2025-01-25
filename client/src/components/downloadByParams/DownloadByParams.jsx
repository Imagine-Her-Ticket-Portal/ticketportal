import React, { useEffect } from "react";
import { useModal } from '../../modalProvider/Modalprovider'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faCircleXmark, faArrowDown, faFileDownload } from "@fortawesome/free-solid-svg-icons";

// import { toast } from "react-toastify"

export default function DownloadByParams({ searchParams, filteredTicketsByParams, startDate, endDate }) {
    const { isAuthenticated, user } = useModal();
    const authToken = localStorage.getItem("authorization")
    useEffect(() => {
        //console.log('Filtered Tickets By Params:', filteredTicketsByParams);
    }, [filteredTicketsByParams])

    const downloadTickets = async (startDate, endDate, searchParams) => {
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
                        startDate: startDate !== null ? startDate : 'No Start Date has been Mentioned',
                        endDate: endDate !== null ? endDate : 'No Start Date has been Mentioned',
                        // searchParams : filteredTicketsByParams.length > 0 ? searchParams : 'No Parameters mentioned',
                        searchParams : filteredTicketsByParams === null ? 'No Parameters Mentioned' : (filteredTicketsByParams.length > 0 && searchParams),
                        filteredTicketsByParams: filteredTicketsByParams
                    }),
                }
            );
            // Check if the response status is OK (2xx)
            if (response.ok) {
                const blob = await response.blob();
                // Create a link element and trigger a download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `tickets_${startDate !== null && startDate}_${endDate !== null && endDate}.csv`;
                link.click();
            } else {
                const errorData = await response.json();
                alert(errorData.message);
                // toast.error(errorData.message || "An error occurred")
            }
        } catch (err) {
            console.error("Error downloading tickets:", err);
        }
    };
    return (
        <>
            {
                isAuthenticated && user.ticketResolved && (
                    <div className='download-button' onClick={() => downloadTickets(startDate, endDate, searchParams)}>
                        Download Tickets
                    </div>
                )
            }
        </>
    )
}