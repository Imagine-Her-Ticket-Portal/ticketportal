import React from "react";
import NavBar from "../../components/navbar/NavBar";
import Hero from "../../components/hero/Hero";
import Sectionend from "../../components/sectionend/Sectionend";
import RaiseTicket from "../../components/raiseTicket/RaiseTicket";

import Footer from "../../components/footer/Footer"
import "./landing.css";

function Landing() {
  return (
    <>
      <NavBar/>
      <Hero/>
      <Sectionend/>
      <RaiseTicket/>
      <Footer/>           
    </>
  );
}

export default Landing;
