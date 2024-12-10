import React, { useState } from "react";
import "./navbar.scss";
import logo from "../../assets/logo.png";
import Login from "../login/Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleUser, faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/profile.png";
import { useModal } from "../../modalProvider/Modalprovider";
import Otp from "../otp/Otp";
import SignUp from "../signUp/SignUp";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import newlogo from "../../assets/logo-new.jpg"

function NavBar() {
  const {
    openSignupModal,
    openLoginModal,
    isAuthenticated,
    user,
    openotpModal,
  } = useModal();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClickServices = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("services");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleClickStories = () => {
    window.open("https://imagineher.org/our-impact", "_blank");
  };

  const handleClickHome = () => {
    navigate("/");
  };

  const handleClickTicketHistory = () => {
    user.role === "client" ? navigate("/ticket-history/requests") : navigate("/admin/ticket-history/requests");
  };

  const handleProfile = () => {
    navigate("/profile");
  };
  const openSignup = () => {
    navigate("/");
    openSignupModal();
  };
  const openOtp = () => {
    navigate("/");
    openotpModal();
  };
  const handleLogo = () => {
    navigate("/");
  };
  const viewAnalytics = () => {
    navigate("/admin/analytics");
  }

  return (
    <>
      <nav>
        <div className="container">
          <div className="logo">
            <img className="company-logo" src={newlogo} alt="company-logo" onClick={handleLogo} />
            {/* <h3>Imagine<span>Her</span></h3> */}
          </div>
          {isAuthenticated && (user.role === "client" || user.role!=="client") ? (
            <div className="loggedin-links">

              <ul>
                {user.role != "client" ? (<li onClick={viewAnalytics}>Analytics Data</li>) : (<li onClick={handleClickHome} className="navlinks">Home</li>)}
                <li onClick={handleClickServices} className="navlinks">Services</li>
                <li onClick={handleClickTicketHistory} className="navlinks">Ticket History</li>
                
              </ul>

              <div className="profile" onClick={handleProfile}>
                <div className="username">
                  <span style={{ color: 'white', fontSize: '15px', paddingRight: '5px' }}>{user.name}</span>
                  <FontAwesomeIcon icon={faCircleUser} size="2xl" />
                </div>
                {/* <img src={profile} alt="profile-pic" className="profile-pic" /> */}
              </div>

            </div>
          ) : (
            <div className="links">
              <ul>
                <li onClick={handleClickHome} className="navlinks">Home</li>
                <li onClick={handleClickServices} className="navlinks">Services</li>
                <li onClick={handleClickStories} className="navlinks">Impact</li>
                <li><Login /></li>
                <li style={{opacity:1}}>
                  <button className="btn-primary" onClick={openSignup}>Signup</button>
                </li> 
              </ul>
            </div>
          )}
          <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <>
            {
              mobileMenuOpen? <FontAwesomeIcon icon={faClose} size="2x" /> : <FontAwesomeIcon icon={faBars} size="2x" />
            }
            </>
            
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <div className="mobile-dropdown">
            {isAuthenticated ? (
              <ul className="mobile-links">
                {/* <li onClick={handleClickHome} className="active">Home</li> */}
                {user.role != "client" ? (<li onClick={viewAnalytics}>Analytics Data</li>) : (<li onClick={handleClickHome} className="navlinks">Home</li>)}
                <li onClick={handleClickServices}>Services</li>
                <li onClick={handleClickTicketHistory}>Ticket History</li>
                {/* <div className="profile" onClick={handleProfile}>
                  <div className="name">{user.name}</div>
                  <img src={profile} alt="profile-pic" className="profile-pic" />
                </div> */}
                <div className="profile" onClick={handleProfile}>
                  <div className="username">
                    <span>{user.name}</span>
                  </div>
                  {/* <img src={profile} alt="profile-pic" className="profile-pic" /> */}
                </div>
              </ul>
            ) : (
              <ul className="mobile-links">
                <li onClick={handleClickHome} className="active">Home</li>
                <li onClick={handleClickServices}>Services</li>
                <li onClick={handleClickStories}>Impact</li>
                <li><Login /></li>
                <li onClick={openSignup}>Signup</li>
              </ul>
            )}

          </div>
        </>
      )}
    </>
  );
}

export default NavBar;
