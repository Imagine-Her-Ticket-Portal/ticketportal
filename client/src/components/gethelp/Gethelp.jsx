import styled from "styled-components";
// import { toast} from "react-toastify"
import React, { useState, useRef, useEffect } from "react";
import Box from "../box/Box";
import ModalBox from '../ModalBox/ModalBox.tsx'
import useModalToggle from '../ModalBox/useModalToggle.tsx'
import "./gethelp.scss";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../../modalProvider/Modalprovider";
import Otp from "../otp/Otp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faCalendarAlt, faCircleXmark, faLocationDot } from "@fortawesome/free-solid-svg-icons";


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
  @media (max-width:600px) {
    width: 90%;
    height:auto;
    padding: 1rem;
    margin: 1rem;
  }
`;

export default function Gethelp(props) {
  const { openSignupModal, isAuthenticated, user, openotpModal } = useModal();
  const navigate = useNavigate();
  const { ticketName, cat, image } = props;
  const authData = localStorage.getItem("user");
  const auth = JSON.parse(authData);
  const modalRef = useRef();
  const [formData, setFormData] = useState({
    request: auth ? "" : localStorage.getItem("formData") || "",
  });

  const [selectedOption, setSelectedOption] = useState(ticketName)
  const [location, setLocation] = useState(user.location)

  const { isOpen, toggle } = useModalToggle();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(()=>{
  //   console.log("user is",user)
  // },[])



  const handlesendOTP = async () => {
    const authToken = localStorage.getItem('authorization');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/otp/resend`, {
        method: 'PATCH',
        headers: {
          Authorization: authToken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        //  toast.success(data.message || "Successfull");
      } else {
        console.err(`Failed to send OTP: ${data.message}`);
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
    }

  };

  function formatDate_dd_mm_yyyy() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    setModalIsOpen(false);
    toggle()
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      localStorage.setItem("formData", formData.request);
      navigate("/");
      openSignupModal();
      return
    }
    if (user && !user.verified) {
      localStorage.setItem("formData", formData.request);
      navigate("/");
      openotpModal();
      handlesendOTP()

    }
    if (isAuthenticated && user.verified) {
      const authToken = localStorage.getItem('authorization');
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/ticket/raise`, {
          method: "POST",
          headers: {
            Authorization: authToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ticket:
            {
              category: cat,
              title: selectedOption,
              message: formData.request,
              location: location,
              businessName: user.businessName !== null && user.businessName
            }
          }),
        });
        const data = await response.json();
        if (response.ok) {
          //console.log(data)
          // Clear the form data after submission
          closeModal();
          // auth &&
          setFormData({
            request: "",
          });
          alert(data.message)
          // toast(data.message)
        } else {
          throw new Error(`Failed to fetch user details: ${data.message}`);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    }
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault(); // Prevent form submission on Enter key press
  //   }
  // };

  //options under the categories [get help, business updates]
  let getHelpOptions = ['Business Strategy', 'Marketing', 'Financial Management', 'Technical Support', 'Operation & Logistics', 'Others']

  let businessUpdatesOptions = ['New Product Launch', 'Marketing', 'Expansion of Business', 'Revenue', 'Others']

  return (
    <>
      <Box ticketName={ticketName} isOpen={modalIsOpen} onClick={toggle} openInPopup={true} image={image} />

      <ModalBox
        isOpen={isOpen} toggle={toggle}
        closeModal={closeModal}
        onRequestClose={closeModal}
        className='modal-overlay'
        contentLabel="GetHelp Modal"
        ariaHideApp={false}
      >
        <ModalContent ref={modalRef}>
          <Otp />
          <div className="cancel-icon" onClick={toggle}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>
          <div className="form-heading-signUp">
            <span>{cat}</span>
          </div>
          <form className="signup-form">
            <div className="grid-container">
              <div className="select-dropdown">
                {
                  cat === "GET HELP" ? <select className="dropdown" name='getHelpDropdown' onChange={(e) => setSelectedOption(e.target.value)} value={selectedOption} >
                    {/* <option value={selectedOption} disabled>{selectedOption}</option> */}
                    {
                      getHelpOptions.map((getHelpOption, index) => {
                        return <option key={index}>{getHelpOption.toUpperCase()}</option>
                      })
                    }
                  </select> : <select className="dropdown" name='businessUpdatesDropdown' onChange={(e) => setSelectedOption(e.target.value)}>
                    <option value={selectedOption}>{selectedOption}</option>
                    {
                      businessUpdatesOptions.map((businessUpdatesOption, index) => {
                        return <option key={index}>{businessUpdatesOption.toUpperCase()}</option>
                      })
                    }
                  </select>
                }
              </div>
              <div className="location" >
                <span className="icon" >
                  <FontAwesomeIcon size="xl" icon={faLocationDot} />
                  <span className="date-text" style={{ color: 'black' }} onChange={() => setLocation(user.location)}>{location}</span>
                </span>
              </div>
              <div className="date" >
                <span className="icon" >
                  <FontAwesomeIcon size="xl" icon={faCalendarAlt} />
                  <span className="date-text" style={{ color: 'black' }}>{formatDate_dd_mm_yyyy()}</span>
                </span>
              </div>
              <div className="business-name">
                <span className="icon" >
                  <FontAwesomeIcon size="xl" icon={faBuilding} />
                  <span className="date-text" style={{ color: 'black' }}>
                    {user.businessName === null || user.businessName === ''
                      ? <Link to='/profile'><span style={{ borderBottom: '2px solid #D81F84', paddingBottom: '1px' }}>Add Business Name Here</span></Link>
                      : user.businessName}
                  </span>
                </span>
              </div>
            </div>
            {/* <div>
              {`> ${ticketName}`}
            </div> */}
            <textarea
              type="text"
              placeholder={`Write concise description of your request for assistance with ${selectedOption}`}
              id="request"
              name="request"
              // onKeyDown={handleKeyDown}
              value={formData.request}
              onChange={handleChange}
              required
            />
            <div className="center">
              <div></div>
              <div
                className="btn-primary submit-request"
                onClick={handleSubmit}
                type="submit"
              >
                Submit Requests
              </div>
              <div></div>
            </div>
          </form>
        </ModalContent>
      </ModalBox>
    </>
  );
}
