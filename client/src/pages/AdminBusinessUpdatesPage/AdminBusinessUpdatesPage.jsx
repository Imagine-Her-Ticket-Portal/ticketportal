import React from 'react'
import './AdminBusinessUpdatesPage.scss'
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import { useModal } from "../../modalProvider/Modalprovider";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import AdminBusinessUpdates from '../../components/adminBusinessUpdates/AdminBusinessUpdates';
import { useLocation, Outlet } from 'react-router-dom';

export default function AdminBusinessUpdatesPage() {
    const { user, isAuthenticated } = useModal()
    const location = useLocation()
    return (
        <>
            {
                (isAuthenticated && user.role !== "client") &&
                <>
                    <main>
                        <AdminHeader page={location} />
                        <AdminBusinessUpdates />
                    </main>
                    <AdminNavbar />
                </>
            }
            <Outlet />
        </>
    );
}