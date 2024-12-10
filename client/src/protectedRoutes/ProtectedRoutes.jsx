
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useModal } from '../modalProvider/Modalprovider';

const ProtectedRoutes = ({ element }) => {
  const { user } = useModal();
  if (user && user.ticketResolved && user.verified) {
    return <Outlet />;
  }
  else if (user.role === "client") {
    return <Navigate to="/" />
  }
  else {
    return <Navigate to="/admin" />
  }
};

export default ProtectedRoutes;
