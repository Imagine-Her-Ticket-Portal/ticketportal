import React from "react";
import "./hero.scss";
import hero from "../../assets/hero.png";
import SignUp from "../signUp/SignUp";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../modalProvider/Modalprovider";
import Otp from "../otp/Otp";
import DownloadButton from "../downloadButton/DownloadButton";
import PreviewButton from "../PreviewTickets/PreviewTickets";
import Analytics from "../analytics/Analytics";

export default function Hero() {
  const { openSignupModal, isAuthenticated, user } = useModal();
  const authToken = localStorage.getItem("authorization");
  const navigate = useNavigate();
  const handleClickServices = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("services");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  const viewRequests = () => {
    navigate("/admin/requests");
  };

  const viewAnalytics = () => {
    navigate("/admin/analytics");
  }

  return (
    <section id="hero" className="container">
      <div className="image-container">
        <img className="hero-image " src={hero} alt="hero"></img>
      </div>
      <div className="text-container">
        <div className="hero-heading">
          {
            !isAuthenticated ? (<>TICKET <br></br>PORTAL</>) : (<>Hello Entrepreneur</>)
          }
          
        </div>
        <div className="center_class">
          <div className="hero-details">
            Unleash the Power of Collaboration and Fuel Your Entrepreneurial
            Journey
          </div>
        </div>
        <SignUp />
        <Otp notsignin={true}></Otp>
        {!isAuthenticated && (
          <div className="center_class">
            <div
              className="hero-button center raise-tickets"
              text="REGISTER NOW"
              onClick={openSignupModal}
            >
              Register Now
            </div>
          </div>
        )}
        {isAuthenticated && user.role === "client" && (
          <>
            
              <div className="hero-button raise-tickets" onClick={handleClickServices}>
                RAISE TICKETS
              </div>
            
          </>
        )}
        {isAuthenticated && user.ticketResolved && (
          <>
            <div className="buttons-container">
              <button className="hero-button" onClick={viewRequests}>Pending Tickets</button>
              {/* <PreviewButton />
              <DownloadButton /> */}
              <button className="hero-button analytics-button" onClick={viewAnalytics}>Analytics Data</button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
