import React from "react";
import Footer from "../../components/footer/Footer";
import NavBar from "../../components/navbar/NavBar";
import Adminsection from "../../components/adminsection/Adminsection";
import Recentrequests from "../../components/recentrequests/Recentrequests";
export default function Admin(props) {
  const recent=props.recent
  const ticketName=props.cat
  const  cat=props.catmain
  return (
    <>
      <NavBar />
      {recent ?<Recentrequests/>:<Adminsection cat={cat} ticketName={ticketName} />}
      <Footer />
    </>
  );
}

Admin.defaultProps={
  recent:false,
};