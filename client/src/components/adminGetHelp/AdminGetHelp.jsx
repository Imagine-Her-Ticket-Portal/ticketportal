import React from 'react'
import { useModal } from "../../modalProvider/Modalprovider";
import Box from '../../components/box/Box'
import GethelpPopup from '../../components/gethelp/Gethelp'
import BusinessStrategy from "../../assets/Business Strategy.png"
import Marketing from "../../assets/IMG_4774.png"
import FinManagement from "../../assets/Financial Management.png"
import TechSupport from "../../assets/Technical Support.png"
import Others from "../../assets/Others.png"
import Operations from "../../assets/Operational Costs & Logistics.png"
import './AdminGetHelp.scss'

const AdminGetHelp = () => {
    const { user, isAuthenticated } = useModal();
    return (
        <div>
            <section className='gethelp-tickets raiseTicket category-section category-top'>
                <div className='heading center_class'>
                    <div>SELECT CATEGORY <br></br>
                        TO <span>GET HELP </span>WITH</div>
                </div>
                <div className='ticket-box '>

                    {(!isAuthenticated || (isAuthenticated && user.role === "client")) &&
                        <>
                            <GethelpPopup ticketName='BUSINESS STRATEGY' cat="GET HELP" image={BusinessStrategy} />
                            <GethelpPopup ticketName='MARKETING' cat="GET HELP" image={Marketing} />
                            <GethelpPopup ticketName='FINANCIAL MANAGEMENT' cat="GET HELP" image={FinManagement} />
                            <GethelpPopup ticketName='TECHNICAL SUPPORT' cat="GET HELP" image={TechSupport} />
                            <GethelpPopup ticketName='OPERATION & LOGISTICS' cat="GET HELP" image={Operations} />
                            <GethelpPopup ticketName='OTHERS' cat="GET HELP" image={Others} />
                        </>}
                    {isAuthenticated && user.ticketResolved &&
                        <>
                            <Box ticketName='BUSINESS STRATEGY' link="/admin/services/get-help/business-strategy" image={BusinessStrategy} />
                            <Box ticketName='MARKETING' link="/admin/services/get-help/marketing" image={Marketing} />
                            <Box ticketName='FINANCIAL MANAGEMENT' link="/admin/services/get-help/financial-management" image={FinManagement} />
                            <Box ticketName='TECHNICAL SUPPORT' link="/admin/services/get-help/technical-support" image={TechSupport} />
                            <Box ticketName='OPERATION & LOGISTICS' link="/services/admin/get-help/operation&logistics" image={Operations} />
                            <Box ticketName='OTHERS' link="/admin/services/get-help/others" image={Others} />
                        </>}
                </div>
            </section>
        </div>
    )
}

export default AdminGetHelp