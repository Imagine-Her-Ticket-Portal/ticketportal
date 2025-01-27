// import Modal from "react-modal";
import ModalBox from '../ModalBox/ModalBox.tsx'
import useModalToggle from '../ModalBox/useModalToggle.tsx'
import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import { useModal } from "../../modalProvider/Modalprovider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faAddressCard, faEnvelope, faCircleXmark, faUser, faU, faVectorSquare, faCalendarAlt, faStopwatch, faBuilding, faTrash } from "@fortawesome/free-solid-svg-icons";
import Accordion from 'react-bootstrap/Accordion';
import profile from "../../assets/profile.png";
import "./viewReq.css";
// import { toast } from 'react-toastify';

// const CustomModal = styled(Modal)`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: rgba(0, 0, 0, 0.5);
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
// `;

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
  @media (max-width:690px) {
    width:280px;
    min-height:430px;
    padding: 5px;
}
`;

export default function ViewReq({ ticket, onClose, onStatusChange, onReferenceCommentChange }) {
  //const ticket = ticket
  const { user, isAuthenticated } = useModal();
  const authToken = localStorage.getItem("authorization");
  const modalRef = useRef();
  const prevStatus = ticket.status
  const [referenceComment, setReferenceComment] = useState('')
  const [editComment, setEditComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [updatedTempComment, setUpdatedTempComment] = useState({})
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [assignedTo, setAssignedTo] = useState(null)
  const [raisedBy, setRaisedBy] = useState('')

  const { isOpen, toggle } = useModalToggle();

  const openModal = () => {
    setModalIsOpen(true);
    toggle()
  };

  const closeModal = () => {
    setModalIsOpen(false);
    toggle()
  };

  const formatDate_dd_mm_yyyy = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function dateResolvedPattern() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const updateStatus = async (newstatus) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/update`,
        {
          method: "PUT",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticket: {
              id: ticket._id,
              assignedTo: (newstatus === "pending" && null) || ((prevStatus === "pending" & newstatus === "resolved") && null),
              status: newstatus,
              dateResolved: newstatus === "resolved" ? dateResolvedPattern() : null,
            }
          })
        }
      );
      const data = await response.json();
      const statusChange = async (ticket, newstatus) => {
        onStatusChange(ticket._id, newstatus);
      }

      if (response.ok) {
        await statusChange(ticket, newstatus)
        alert(data.message)
        // toast.success(data.message)
        closeModal()
      } else {
        throw new Error(`Failed to update ticket status: ${data.message}`);
      }
    } catch (err) {
      console.error("Error updating ticket status:", err);
    }
  };
  //console.log(ticket)

  const submitReferenceComment = async () => {
    if (referenceComment.length < 3) {
      alert('Reference Comment must have atleast 3 characters')
      // toast("Reference comment must have atleast 3 characters")
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/reference-comment`,
        {
          method: "PUT",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticket: {
              id: ticket._id,
              referenceComment: referenceComment,
              authorName: authorName
            }
          })
        }
      );
      const data = await response.json();
      const commentChange = async (ticket, referenceComment, authorName) => {
        onReferenceCommentChange(ticket._id, referenceComment, authorName);
      }
    
      if (response.ok) {
        await commentChange(ticket, referenceComment, data.ticket.authorName)
        setAuthorName(authorName)
        setUpdatedTempComment(data.ticket)
        alert(data.message);
        // toast.success(data.message)
        closeModal()
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to submit reference comment: ${errorData.message}`);
      }
      setReferenceComment('')
      //setAuthorName('')
    } catch (err) {
      console.error("Error submitting reference comment:", err);
    }
  };

  const editReferenceComment = async () => {

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/edit-comment`,
        {
          method: "PATCH",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticket: {
              id: ticket._id,
              referenceComment: editComment,
              authorName: authorName
            }
          })
        }
      );
      const data = await response.json();

      if (response.ok) {
        setEditComment(editComment)
        setReferenceComment(editComment)
        setUpdatedTempComment(data.ticket)
        alert(data.message);
        // toast.success(data.message)
        closeModal()
      } else {
        throw new Error(`Failed to submit reference comment: ${data.message}`);
      }
    } catch (err) {
      console.error("Error submitting reference comment:", err);
    }
  };

  useEffect(()=>{
    setAuthorName(authorName)
  },[authorName])

  const deleteTicket = async () => {
    const authToken = localStorage.getItem("authorization");
  
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/delete/${ticket._id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );
  
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          // toast.success(data.message)
          closeModal()
          window.location.reload()
        } else {
          alert(data.message);
          // toast.error(data.message || "An error occurred")
        }
      } catch (err) {
        console.error("Error deleting ticket:", err);
      }
    }
  };
  
  return (
    <>
      <div className="container2-req" onClick={toggle}>
        <div className="view-button">View</div>
      </div>

      <ModalBox
        isOpen={isOpen}
        toggle={toggle}
        closeModal={closeModal}
        onRequestClose={closeModal}
        className='modal-overlay'
        contentLabel="View Req Modal"
        ariaHideApp={false}
      >
        <ModalContent ref={modalRef}>
          <div>
            <div className='row ticket-popup-icons'>
              <div className='col delete-icon col-sm-6'><FontAwesomeIcon onClick={deleteTicket} icon={faTrash} /></div>
              <div className='col cross-icon col-sm-6'><FontAwesomeIcon  onClick={toggle} icon={faCircleXmark} /></div>
            </div>
          </div>
          <div className="user-details">
            <div className="profile-pic">
              <div className="user-deatils">
                {user && user.role === "client" ? <>
                  <div className='row details-client'>
                    <div className='details-heading-client col-lg-3 col-md-3 col-sm-12'>
                      <p>User Details :</p>
                    </div>
                    <div className='col-lg-9 col-md-9 col-sm-12'>
                      <div className='row'>
                        <div>
                          <span>
                            <FontAwesomeIcon className='details-description-icon-client detail-icons' size="lg" icon={faAddressCard} />
                            <span style={{ textTransform: 'capitalize', color: 'black' }}>{user.name}</span>
                          </span>
                        </div>
                        <div className='details-description-email'>
                          <span>
                            <FontAwesomeIcon className='details-description-icon-client detail-icons' size="lg" icon={faEnvelope} />
                            <span style={{ color: 'black' }}>{user.email}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </> : <>
                  <div className='row details'>
                    <div className='details-heading col-lg-3 col-md-3 col-sm-12'>
                      <p>Raised By :</p>
                    </div>
                    <div className='col-lg-9 col-md-9 col-sm-12'>
                      <div className='row'>
                        <div>
                          <span>
                            <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faAddressCard} />
                            <span style={{ textTransform: 'capitalize', color: 'black' }}>{ticket.raisedBy.name}</span>
                          </span>
                        </div>
                        <div className='details-description-email'>
                          <span>
                            <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faEnvelope} />
                            <span style={{ color: 'black' }}>{ticket.raisedBy.email}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {ticket.status && ticket.status === "inreview" && ticket.assignedTo && (
                    <div className='row details'>
                      <div className='details-heading col-lg-3 col-md-3 col-sm-12'>
                        <p>Assigned To :</p>
                      </div>
                      <div className='col-lg-9 col-md-9 col-sm-12'>
                        <div className='row'>
                          <div>
                            <span>
                              <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faUser} />
                              <span style={{ textTransform: 'capitalize', color: 'black' }}>{ticket.assignedTo.name}</span>
                            </span>
                          </div>
                          <div className='details-description-email'>
                            <span>
                              <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faEnvelope} />
                              <span style={{ color: 'black' }}>{ticket.assignedTo.email}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {ticket.status && ticket.status === "resolved" && (ticket.assignedTo !== null &&
                    <div className='row details'>
                      <div className='details-heading col-lg-3 col-md-3 col-sm-12'>
                        <p>Assigned To :</p>
                      </div>
                      <div className='col-lg-9 col-md-9 col-sm-12'>
                        <div className='row'>
                          <div>
                            <span>
                              <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faUser} />
                              <span style={{ textTransform: 'capitalize', color: 'black' }}>{ticket.assignedTo.name}</span>
                            </span>
                          </div>
                          <div className='details-description-email'>
                            <span>
                              <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faEnvelope} />
                              <span style={{ color: 'black' }}>{ticket.assignedTo.email}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>}
                <div className='row details'>
                  <div className='details-heading col-lg-3 col-md-3 col-sm-12'>
                    <p>Category :</p>
                  </div>
                  <div className='col-lg-9 col-md-9 col-sm-12'>
                    <span>
                      <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faVectorSquare} />
                      <span style={{ textTransform: 'capitalize', color: 'black' }}>{ticket.title}</span>
                    </span>
                  </div>
                </div>
                <div className='row details'>
                  <div className='details-heading col-lg-3 col-md-3 col-sm-12'>
                    <p>Assigned To :</p>
                  </div>
                  <div className='col-lg-9 col-md-9 col-sm-12'>
                    <span>
                      <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faVectorSquare} />
                      <span style={{ textTransform: 'capitalize', color: 'black' }}> {ticket.assignedTo?.name ? ticket.assignedTo.name : 'Not Assigned Yet'}</span>
                    </span>
                  </div>
                </div>
                <div className='row details'>
                  <div className='details-heading col-lg-3 col-md-3 col-sm-12'>
                    <p>Business Name :</p>
                  </div>
                  <div className='col-lg-8 col-md-8 col-sm-12'>
                    <span>
                      <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faBuilding} />
                      {
                        user.role !== 'client' && ((ticket.raisedBy.businessName !== null && ticket.raisedBy.businessName.length !== 0) ? ticket.raisedBy.businessName : <span style={{ borderBottom: '2px solid #D81F84', paddingBottom: '1px' }}>Not Added Yet</span>)
                      }
                      {
                        user.role === 'client' && ((user.businessName !== null && user.businessName.length !== 0) ? <span style={{ color: 'black' }}>{user.businessName}</span> : <span style={{ borderBottom: '2px solid #D81F84', paddingBottom: '1px' }}>Not Added Yet</span>)
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className='date-details'>
              <div className='details-heading'>Raised on :</div>
              <span>
                <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faCalendarAlt} />
                <span style={{ textTransform: 'capitalize', color: 'black' }}>{formatDate_dd_mm_yyyy(ticket.dateRaised)}</span>
              </span>
              <br /><br />
              {ticket.status === "resolved" && <>
                <div className='details-heading'>Resolved on :</div>
                <span>
                  <FontAwesomeIcon className='details-description-icon detail-icons' size="lg" icon={faCalendarAlt} />
                  <span style={{ textTransform: 'capitalize', color: 'black' }}>{formatDate_dd_mm_yyyy(ticket.dateResolved)}</span>
                </span>
              </>}
            </div>
          </div>
          <div style={{ margin: '10px 20px' }}>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header className='accordion-heading-text'>Ticket Description</Accordion.Header>
                <Accordion.Body className='accordion-text'>
                  {ticket.message}
                </Accordion.Body>
              </Accordion.Item>
              {
                user.role === "client" && (
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className='accordion-heading-text'>Reference Comment</Accordion.Header>
                    <Accordion.Body className='accordion-text'>
                      {ticket.referenceComment === null ? 'Reference comment has not been added' : ticket.referenceComment}
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
              {
                user.role !== "client" && (
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className='accordion-heading-text'>Reference Comment</Accordion.Header>
                    <Accordion.Body className='accordion-text'>
                      {
                        user.role !== "client" && (
                          ticket.status === "pending" && (
                            ticket.referenceComment === null || ticket.referenceComment === ''
                              ? <p>No reference comment has been added yet</p>
                              : (
                                <div>
                                  {
                                    ticket.referenceComment && ticket.authorName!=="" && `${ticket.referenceComment} - ${ticket.authorName}`
                                  }
                                </div>
                              )
                          )
                        )
                      }
                      {
                        user.role !== "client" && (ticket.status === 'inreview') && (
                          //add input reference comment here 
                          <div>
                            <textarea
                              type="text"
                              value={(ticket.referenceComment === null || ticket.referenceComment === '') ? referenceComment : editComment}
                              className='text-area'
                              onChange={(ticket.referenceComment === null || ticket.referenceComment === '') ? (e) => setReferenceComment(e.target.value) : (e) => setEditComment(e.target.value)}
                              placeholder={`${(ticket.referenceComment === null || ticket.referenceComment === '') ? `No reference comment has been added yet` : ticket.referenceComment}`}
                              rows={10}
                              cols={50}
                              required
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
                              <div>
                              {
                                (ticket.referenceComment === '' || ticket.referenceComment === null) 
                                ? <button className='submit-comment-button' onClick={submitReferenceComment}>Submit Comment</button> 
                                : <button className='edit-comment-button' onClick={editReferenceComment}>Update Comment</button>
                              }
                              </div>
                              <div>
                              <p>Comment Added By : {(updatedTempComment.authorName && updatedTempComment.authorName.length>1 ) ? updatedTempComment.authorName : ticket.authorName}</p>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      {
                        user.role !== "client" && (ticket.status === 'resolved') && (
                          //add input reference comment here 
                          <div>
                            <textarea
                              type="text"
                              // value={referenceComment}
                              value={(ticket.referenceComment === null || ticket.referenceComment === '') ? referenceComment : editComment}
                              className='text-area'
                              onChange={(ticket.referenceComment === null || ticket.referenceComment === '') ? (e) => setReferenceComment(e.target.value) : (e) => setEditComment(e.target.value)}
                              placeholder={`${(ticket.referenceComment === null || ticket.referenceComment === '') ? `No reference comment has been added yet` : ticket.referenceComment}`}
                              rows={10}
                              cols={50}
                              required
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection:'row-reverse' }}>
                              <div>
                              {
                                (ticket.referenceComment === '' || ticket.referenceComment === null) 
                                ? <button className='submit-comment-button' onClick={submitReferenceComment}>Submit Comment</button> 
                                : <button className='edit-comment-button' onClick={editReferenceComment}>Update Comment</button>
                              }
                              </div>
                              <div>
                              <p>Comment Added By : {(updatedTempComment.authorName && updatedTempComment.authorName.length>1 ) ? updatedTempComment.authorName : ticket.authorName}</p>
                              </div>
                            </div>
                          </div>
                        )
                      }
                    </Accordion.Body>
                  </Accordion.Item>
                )
              }
            </Accordion>
          </div>

          <div className='mark-buttons-container'>
            {isAuthenticated && user.ticketResolved && ticket.status === "pending" && (
              <div className='margin adjust-mark-buttons'>
                <div className='ticket-status'>
                  <span>
                    <FontAwesomeIcon className='details-description-icon' size="lg" icon={faStopwatch} />
                    <span style={{ textTransform: 'uppercase', fontWeight: '600', color: 'black' }}>{ticket.status}</span>
                  </span>
                </div>
                <div className="status-buttons">
                  <button className='mark-button' onClick={() => updateStatus("inreview")}>Mark as Inreview</button>
                </div>
              </div>
            )
            }
            {isAuthenticated && user.ticketResolved && ticket.status === "inreview" && (
              <div className='margin adjust-mark-buttons'>
                <div className='ticket-status'>
                  <span>
                    <FontAwesomeIcon className='details-description-icon' size="lg" icon={faStopwatch} />
                    <span style={{ textTransform: 'uppercase', fontWeight: '600', color: 'black' }}>{ticket.status}</span>
                  </span>
                </div>
                <div className="status-buttons">
                  <button className='mark-button' style={{ margin: '0 10px' }} onClick={() => updateStatus("pending")}>Mark in Pending</button>
                  <button className="mark-button" onClick={() => updateStatus("resolved")}>Mark as Resolved</button>
                </div>
              </div>
            )
            }
            {isAuthenticated && user.ticketResolved && ticket.status === "resolved" && (
              <div className='margin adjust-mark-buttons'>
                <div className='ticket-status'>
                  <span>
                    <FontAwesomeIcon className='details-description-icon' size="lg" icon={faStopwatch} />
                    <span style={{ textTransform: 'uppercase', fontWeight: '600', color: 'black' }}>{ticket.status}</span>
                  </span>
                </div>
                <div className="status-buttons">
                  <button className="mark-button" style={{ margin: '0 10px' }} onClick={() => updateStatus("pending")}>Mark as Pending</button>
                  <button className="mark-button" onClick={() => updateStatus("inreview")}>Mark as Inreview</button>
                </div>
              </div>
            )
            }
          </div>
        </ModalContent>
      </ModalBox>
    </>
  );
}
