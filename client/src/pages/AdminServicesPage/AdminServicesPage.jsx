import React from "react";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import "./adminServices.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import AdminServices from '../../components/adminServices/AdminServices'
import AdminHeader from "../../components/adminHeader/AdminHeader";
import { useLocation, Outlet } from "react-router-dom";

export default function AdminServicesPage() {
    const { user, isAuthenticated } = useModal()
    const authToken = localStorage.getItem("authorization");
    const location = useLocation()
    return (
        <>
            <main>
                <AdminHeader page={location} />
                <AdminServices />
            </main>
            <AdminNavbar />
            <Outlet />
        </>
    );
}