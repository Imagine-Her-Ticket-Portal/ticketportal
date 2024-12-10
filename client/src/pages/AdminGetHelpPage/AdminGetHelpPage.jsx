import React from 'react'
import './AdminGetHelpPage.scss'
import { useLocation, Outlet } from 'react-router-dom'
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import { useModal } from "../../modalProvider/Modalprovider";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import AdminGetHelp from '../../components/adminGetHelp/AdminGetHelp';

export default function AdminGetHelpPage() {
    const { user, isAuthenticated } = useModal()
    const location = useLocation()
    return (
        <>
            {
                (isAuthenticated && user.role !== "client") &&
                <>
                    <main>
                        <AdminHeader />
                        <AdminGetHelp />
                    </main>
                    <AdminNavbar />
                </>
            }
            <Outlet />
        </>
    );
}