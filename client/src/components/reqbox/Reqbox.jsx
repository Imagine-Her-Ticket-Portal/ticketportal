import React from "react";
import "./reqbox.css";
import { useModal } from "../../modalProvider/Modalprovider";
import ViewReq from "../viewReq/ViewReq";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVectorSquare, faStopwatch, faCalendarAlt, faLocationDot, faUser, faAddressCard, faBuilding } from "@fortawesome/free-solid-svg-icons";

export default function Reqbox({ ticket, onClose, onStatusChange, onReferenceCommentChange }) {

  const formatDate_dd_mm_yyyy = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const { user } = useModal()
  return (
    <div className="container-fluid ticket-container">
      <div className="col-lg-9 col-md-9 col-sm-12 ticket-details-column-1">
        <div className="row">
          <p className="ticket-element ticket-title">Help in {ticket.title} in the {user.role !=="client" ? ticket.raisedBy.location : user.location}</p>
        </div>
        <div className="row ticket-details">
          {
            ticket.status !== "pending" && user.role !== "client" && ticket.assignedTo !== null && (
              <>
                <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small">
                  <span className="icon ticket-element icon-details">
                    <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faAddressCard} />
                    <span style={{ color: '##D81F84', fontWeight: '600', textTransform: 'capitalize' }}>Raised By : {ticket.raisedBy.name}</span>
                  </span>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small">
                  <span className="icon ticket-element icon-details">
                    <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faStopwatch} />
                    <span style={{ color: '##D81F84', fontWeight: '600', textTransform: 'capitalize' }}>{ticket.status}</span>
                  </span>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small">
                  <span className="icon ticket-element icon-details">
                    <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faUser} />
                    <span style={{ color: '##D81F84', fontWeight: '600', textTransform: 'capitalize' }}>Assigned To : {ticket.assignedTo.name}</span>
                  </span>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small">
                  <span className="icon ticket-element icon-details">
                    <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faVectorSquare} />
                    <span style={{ color: '##D81F84', fontWeight: '600', textTransform: 'capitalize' }}>{ticket.category}</span>
                  </span>
                </div>
              </>
            )
          }
          {
            (ticket.status === "pending" || (user.role && user.role === "client")) && (
              <>
                <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small">
                  <span className="icon ticket-element icon-details">
                    <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faAddressCard} />
                    {
                      (user.role && user.role === "client") ? <span style={{ color: '# : #D81F84', fontWeight: '600', textTransform: 'capitalize' }}>Raised By : {user.name}</span> : <span style={{ color: '# : #D81F84', fontWeight: '600' }}>Raised By : {ticket.raisedBy.name}</span>
                    }
                  </span>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small">
                  <span className="icon ticket-element icon-details">
                    <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faVectorSquare} />
                    <span style={{ color: '##D81F84', fontWeight: '600', textTransform: 'capitalize' }}>{ticket.category}</span>
                  </span>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small">
                  <span className="icon ticket-element icon-details">
                    <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faStopwatch} />
                    <span style={{ color: '##D81F84', fontWeight: '600', textTransform: 'capitalize' }}>{ticket.status}</span>
                  </span>
                </div>
                
        
                    <div className="col-lg-3 col-md-6 col-sm-12 icon-details-small"> 
                      <span className="icon ticket-element icon-details">
                        <FontAwesomeIcon size="xl" className="icon-text-grid" icon={faUser} />
                        <span style={{ color: '#D81F84', fontWeight: '600', textTransform: 'capitalize' }}>
                        Assigned To : {ticket.assignedTo?.name ? ticket.assignedTo.name : 'Not Assigned Yet'}
                        </span>
                      </span>
                    </div>


              </>
            )
          }
        </div>
        <div className="row">
          <p className="ticket-element message">
            {ticket.message.split(" ").length > 30
              ? ticket.message.split(" ").slice(0, 30).join(" ") + "..."
              : ticket.message}
          </p>
        </div>
      </div>
      <div className="col-lg-3 col-md-3 col-sm-12 ticket-details-column-2">
        <div className="ticket-element icon-details">
          <span>
            <FontAwesomeIcon size="xl" className='icon' icon={faBuilding} />
            <span className="icon-text" style={{ color: 'black', fontWeight: '500' }}>
              {
                user.role !== 'client' && ((ticket.raisedBy.businessName !== null && ticket.raisedBy.businessName.length !== 0) ? ticket.raisedBy.businessName : <span style={{ borderBottom: '2px solid #D81F84', paddingBottom: '1px' }}>Not Added Yet</span>)
              }
              {
                user.role === 'client' && ((user.businessName !== null && user.businessName.length !== 0) ? <span style={{ color: 'black' }}>{user.businessName}</span> : <span style={{ borderBottom: '2px solid #D81F84', paddingBottom: '1px' }}>Not Added Yet</span>)
              }
            </span>
          </span>
        </div>
        <div className="ticket-element icon-details">
          <span>
            <FontAwesomeIcon size="xl" className='icon' icon={faLocationDot} />
            <span className="icon-text" style={{ color: 'black', fontWeight: '500' }}>{user.role !=="client" ? ticket.raisedBy.location : user.location}</span>
          </span>
        </div>
        <div className="ticket-element icon-details col-sm-12">
          <span>
            <FontAwesomeIcon size="xl" className='icon' icon={faCalendarAlt} />
            <span className="icon-text" style={{ color: 'black', fontWeight: '500' }}>{formatDate_dd_mm_yyyy(ticket.dateRaised)}</span>
          </span>
        </div>
        <div className="ticket-element">
          <ViewReq ticket={ticket} onClose={onClose} onStatusChange={onStatusChange} onReferenceCommentChange={onReferenceCommentChange} />
        </div>
      </div>
    </div>
  );
}
