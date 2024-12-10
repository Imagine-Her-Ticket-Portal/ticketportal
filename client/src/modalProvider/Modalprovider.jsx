import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [signupModalIsOpen, setSignupModalIsOpen] = useState(false);
  const [otpModalIsOpen, setOtpModalIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const getUserDetails = async (authToken) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });

      if (response.status === 200) {
        const userData = await response.json();
        setUser(userData)
      } else {
        setLogout();
        const errorData = await response.json();
        throw new Error(`Failed to fetch user details: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {

      const authToken = localStorage.getItem('authorization')
      if (authToken) {
        setLogin()
        await getUserDetails(authToken);
      }
      else {
        setLogout()
      }
    }

    initAuth()
  }, [])

  const setLogin = () => {
    setIsAuthenticated(true)
  }
  const setLogout = () => {
    setIsAuthenticated(false)
  }
  const openLoginModal = () => {
    setLoginModalIsOpen(true);
  };

  const openotpModal = () => {
    setOtpModalIsOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalIsOpen(false);
  };

  const closeotpModal = () => {
    setOtpModalIsOpen(false);
  };

  const openSignupModal = () => {
    setSignupModalIsOpen(true);
  };

  const closeSignupModal = () => {
    setSignupModalIsOpen(false);
  };

  const contextValue = {
    openLoginModal,
    closeLoginModal,
    loginModalIsOpen,
    openSignupModal,
    closeSignupModal,
    signupModalIsOpen,
    otpModalIsOpen,
    openotpModal,
    closeotpModal,
    isAuthenticated,
    user,
    setUser,
    setLogin,
    setLogout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useModal() {
  return useContext(AppContext);
}
