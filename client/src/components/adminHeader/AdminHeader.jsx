import React from 'react'
import { useModal } from "../../modalProvider/Modalprovider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './AdminHeader.scss'
import AdminBreadcrumbs from '../adminBreadcrumbs/AdminBreadcrumbs';

const AdminHeader = () => {
    const navigate = useNavigate()
    const { user } = useModal()
    const location = useLocation()
    const handleProfile = () => {
        navigate("/admin/profile");
    }

    return (
        <>
            <div className='adjust-profile'>
                <div className='breadcrumbs-display'>
                    <AdminBreadcrumbs />
                </div>
                <div className="profile-button" onClick={handleProfile}>
                    <span style={{ color: 'white', paddingRight: '5px' }}>{user.name}</span>
                    <FontAwesomeIcon icon={faCircleUser} size="xl" />
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default AdminHeader