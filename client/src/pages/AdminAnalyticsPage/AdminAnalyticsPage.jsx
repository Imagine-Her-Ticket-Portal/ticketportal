import React from "react";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import "./adminAnalytics.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import AdminAnalytics from "../../components/adminAnalytics/AdminAnalytics";
// import { useLocation, Outlet } from "react-router-dom";

export default function AdminAnalyticsPage() {
    const { user, isAuthenticated } = useModal()
    const authToken = localStorage.getItem("authorization");
    // const location = useLocation()
    return (
        <>
            {
                (isAuthenticated && user.role !== "client") &&
                <>
                    <main>
                        <AdminHeader />
                        <AdminAnalytics />
                    </main>
                    <AdminNavbar />
                </>
            }
            {/* <Outlet /> */}
        </>
    );
}