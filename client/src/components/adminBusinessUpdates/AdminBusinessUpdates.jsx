import React from 'react'
import './AdminBusinessUpdates.scss'
import { useModal } from "../../modalProvider/Modalprovider";
import Box from '../../components/box/Box'
import GethelpPopup from '../../components/gethelp/Gethelp'
import Launch from "../../assets/New Product Launch.png"
import Marketing from "../../assets/IMG_4774.png"
import Expansion from "../../assets/1BSC8075.png"
import Revenue from "../../assets/Revenue.png"
import Others from "../../assets/Others.png"
import './AdminBusinessUpdates.scss'


const AdminBusinessUpdates = () => {
    const { user, isAuthenticated } = useModal();
    return (
        <div>
            <section className='gethelp-tickets raiseTicket category-top'>
                <div className='heading'>
                    <div>SELECT CATEGORY <br></br>
                        FOR <span>BUSINESS UPDATES</span></div>
                </div>
                <div className='ticket-box '>
                    {(!isAuthenticated || (isAuthenticated && user.role === "client")) &&
                        <>
                            <GethelpPopup ticketName='NEW PRODUCT LAUNCH' cat="BUSINESS UPDATES" image={Launch} />
                            <GethelpPopup ticketName='MARKETING' cat="BUSINESS UPDATES" image={Marketing} />
                            <GethelpPopup ticketName='EXPANSION OF BUSINESS' cat="BUSINESS UPDATES" image={Expansion} />
                            <GethelpPopup ticketName='REVENUE' cat="BUSINESS UPDATES" image={Revenue} />
                            <GethelpPopup ticketName='OTHERS' cat="BUSINESS UPDATES" image={Others} />
                        </>}
                    {isAuthenticated && user.ticketResolved &&
                        <>
                            <Box ticketName='NEW PRODUCT LAUNCH' link="/admin/services/business-updates/new-product-launch" cat="BUSINESS UPDATES" image={Launch} />
                            <Box ticketName='MARKETING' link="/admin/services/business-updates/marketing" cat="BUSINESS UPDATES" image={Marketing} />
                            <Box ticketName='EXPANSION OF BUSINESS' link="/admin/services/business-updates/expansion-of-business" cat="BUSINESS UPDATES" image={Expansion} />
                            <Box ticketName='REVENUE' link="/admin/services/business-updates/revenue" cat="BUSINESS UPDATES" image={Revenue} />
                            <Box ticketName='OTHERS' link="/admin/services/business-updates/others" cat="BUSINESS UPDATES" image={Others} />
                        </>}

                </div>
            </section>
        </div>
    )
}

export default AdminBusinessUpdates