import React from "react";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import "./adminTicketHistory.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import AdminTicketHistory from "../../components/adminTicketHistory/AdminTicketHistory";
import { useLocation, Outlet } from "react-router-dom";

export default function AdminTicketHistoryPage() {
    const { user, isAuthenticated } = useModal()
    const authToken = localStorage.getItem("authorization");
    const location = useLocation()
    return (
        <>
            {
                (isAuthenticated && user.role !== "client") &&
                <>
                    <main>
                        <AdminHeader />
                        <AdminTicketHistory />
                    </main>
                    <AdminNavbar />
                </>
            }
            {/* <Outlet /> */}
        </>
    );
}