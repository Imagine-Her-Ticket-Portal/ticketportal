import React from 'react'
import './AdminServices.scss'
import Box from '../box/Box'
import Resources from "../../assets/Resources.png"
import GetHelp from "../../assets/Get Help.png"
import Business from "../../assets/IMG_4774.png"


const AdminServices = () => {
    return (
        <section className='section-container' id='services'>
            <h1 className='tickets-heading'>Services</h1>
            <div className='boxes'>
                <div className='box'><Box ticketName='GET HELP' link="/admin/get-help" image={GetHelp} /></div>
                <div className='box'><Box ticketName='BUSINESS UPDATES' link="/admin/business-updates" image={Business} /></div>
                <div className='box'><Box ticketName='RESOURCES' link="https://imagineher.netlify.app/our-work" image={Resources} /></div>
            </div>
        </section>
    )
}

export default AdminServices