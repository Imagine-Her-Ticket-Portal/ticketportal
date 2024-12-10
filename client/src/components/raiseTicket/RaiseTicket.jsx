import React from 'react'
import "./raiseTicket.css"
import Box from '../box/Box'
import Resources from "../../assets/Resources.png"
import GetHelp from "../../assets/Get Help.png"
import Business from "../../assets/IMG_4774.png"


export default function RaiseTicket() {
  return (
    <section className='raiseTicket' id='services'>
        <div className='heading center_class'>
            <div>SELECT CATEGORY <br></br>
                 TO <span>RAISE TICKET</span></div>
        </div>
        <div className='ticket-box'>
            <Box ticketName='GET HELP' link="/get-help" image={GetHelp}/>
            <Box ticketName='BUSINESS UPDATES' link="/business-updates" image={Business}/>
            <Box ticketName='RESOURCES' link="https://imagineher.org/programs/social-enterprise-innovation-program" image={Resources}/>
        </div>
    </section>
  )
}
