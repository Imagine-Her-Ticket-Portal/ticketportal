import React from "react";
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import "./adminHomePage.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import AdminHome from "../../components/adminHome/AdminHome";
import AdminHeader from "../../components/adminHeader/AdminHeader";
// import { useLocation, Outlet } from "react-router-dom";

export default function AdminHomePage() {
  const { user, isAuthenticated } = useModal()
  // const location = useLocation()
  return (
    <>
      {
        (isAuthenticated && user.role !== "client") &&
        <>
          <main>
            <AdminHeader />
            <AdminHome />
          </main>
          <AdminNavbar />
        </>
      }
      {/* <Outlet /> */}
    </>
  );
}