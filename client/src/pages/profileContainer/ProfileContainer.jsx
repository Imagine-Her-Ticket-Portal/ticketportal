import React from 'react'
import Footer from '../../components/footer/Footer'
import NavBar from '../../components/navbar/NavBar'
import Profile from '../../components/profile/Profile'
import "./ProfileContainer.css"
import TicketSummary from '../../components/ticketSummary/TicketSummary'
export default function ProfileContainer() {
  return (
    <>
      <NavBar />
      <div className='main-content'>
        <Profile />
        {/* <TicketSummary/> */}
        <Footer />
      </div>
    </>
  )
}
