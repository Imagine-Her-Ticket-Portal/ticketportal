import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faHouse } from "@fortawesome/free-solid-svg-icons";
import './AdminBreadcrumbs.scss';

const AdminBreadcrumbs = () => {
    const location = useLocation();
    const [segments, setSegments] = useState([]);

    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(segment => segment);
        const adminIndex = pathSegments.indexOf('admin');
        if (adminIndex !== -1) {
            setSegments(pathSegments.slice(adminIndex + 1));
        } else {
            setSegments([]);
        }
    }, [location]);

    const constructLinkPath = (index) => {
        const basePath = '/admin';
        const path = segments.slice(0, index + 1).join('/');
        return `${basePath}/${path}`;
    };

    return (
        <div className="breadcrumbs">
            {
                (location.pathname.includes('/admin/services') || location.pathname.includes('/admin/get-help') || location.pathname.includes('/admin/business-updates')) && (
                    <>
                        <FontAwesomeIcon className='icon-logo' icon={faHouse} />
                        {location.pathname !== '/admin/services' && segments.length < 2 && (
                            <>
                                <Link
                                    to='/admin/services'
                                    className="p-3 link"
                                >
                                    <span>Services</span>
                                </Link>
                                <FontAwesomeIcon className='icon-logo' icon={faAnglesRight} />
                            </>
                        )}

                        {segments.map((segment, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <FontAwesomeIcon className='icon-logo' icon={faAnglesRight} />}
                                <Link
                                    to={constructLinkPath(index)}
                                    className="p-3 link"
                                >
                                    <span>{segment.replace('-', ' ')}</span>
                                </Link>
                            </React.Fragment>
                        ))}
                    </>
                )
            }
        </div>
    );
};

export default AdminBreadcrumbs;
