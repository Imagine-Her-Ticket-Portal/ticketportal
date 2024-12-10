import React from 'react'
import './AdminCategoryContentPage.scss'
import { Outlet, useLocation } from 'react-router-dom';

import Recentrequests from "../../components/recentrequests/Recentrequests";
import AdminNavbar from '../../components/adminNavbar/AdminNavbar';
import AdminHeader from '../../components/adminHeader/AdminHeader';
import AdminTicketSection from '../../components/adminTicketSection/AdminTicketSection';
import AdminRecentRequests from '../../components/adminRecentRequests/AdminRecentRequests';

export default function AdminCategoryContentPage(props) {
    const recent = props.recent
    const ticketName = props.cat
    const cat = props.catmain
    const location = useLocation()
    return (
        <>
            <main className='category-main'>
                <AdminHeader page={location} />
                {/* {recent ? <Recentrequests /> : <Adminsection cat={cat} ticketName={ticketName} />} */}
                {recent ? <AdminRecentRequests /> : <AdminTicketSection cat={cat} ticketName={ticketName} />}
            </main>
            <AdminNavbar />
            <Outlet />
        </>
    );
}

AdminCategoryContentPage.defaultProps = {
    recent: false,
};