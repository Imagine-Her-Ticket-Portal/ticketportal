import React from "react";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import "./AdminProfilePage.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import AdminProfile from "../../components/adminProfile/AdminProfile";
// import { Outlet } from 'react-router-dom'

export default function AdminProfilePage() {
    const { user, isAuthenticated } = useModal()
    const authToken = localStorage.getItem("authorization");

    return (
        <>
            {
                (isAuthenticated && user.role !== "client") &&
                <>
                    <main>
                        <AdminHeader />
                        <AdminProfile />
                    </main>
                    <AdminNavbar />
                </>
            }
            {/* <Outlet /> */}
        </>
    );
}