import React from "react";
import Footer from "../../components/footer/Footer";
import NavBar from "../../components/navbar/NavBar";
import TicketRequestssection from "../../components/ticket-popup/Ticket_popup";
import TicketRequestSectionClient from '../../components/ticket-popup/TicketRequestSectionClient'
import './ticketrequests.css'

export default function TicketRequests({ admin }) {

  return (
    <>
      <NavBar />
      {
        admin ? <TicketRequestssection /> : <TicketRequestSectionClient />
      }
      <Footer />
    </>
  );
}
