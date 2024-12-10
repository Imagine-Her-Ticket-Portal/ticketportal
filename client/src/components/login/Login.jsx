import Modal from "react-modal";
import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import { useModal } from "../../modalProvider/Modalprovider";
import ModalBox from '../ModalBox/ModalBox.tsx';
import useModalToggle from '../ModalBox/useModalToggle.tsx';
import "./login.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useOnKeyPress } from "../../hooks/useOnKeyPress";
import { v4 as uuidv4 } from 'uuid';

// import { toast } from 'react-toastify';



const CustomModal = styled(Modal)`
  display: none;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ModalContent = styled.div`
  width: 500px;
  height: 550px;
  flex-shrink: 0;
  border-radius: 16.477px;
  box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #888;
  display: block;
  z-index: 10;
  opacity: 1 !important;
  @media (max-width: 600px) {
    width: 90%;
    height: auto;
    padding: 1rem;
    margin: 1rem;
  }
`;


export default function Login(props) {
  const {
    openSignupModal,
    loginModalIsOpen,
    closeLoginModal,
    openLoginModal,
    setLogin,
    setUser,
    isAuthenticated,
    user
  } = useModal();
  const navigate = useNavigate();
  const { styleName, text } = props;
  const modalRef = useRef();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    sessionId: uuidv4()
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen, toggle } = useModalToggle();
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null); // State for abort controller

  const closeModal = () => {
    if (abortController) {
      abortController.abort(); 
      console.log('Login process aborted');
    }
    setFormData({ email: "", password: "", sessionId: "" }); // Clear form data
    setLoading(false); // Stop the loader
    toggle(); // Close the modal
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const determineUserRole = (email) => {
    return email.endsWith("@i-her.org") ? "admin" : "user";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const controller = new AbortController();
    setAbortController(controller); // Set the abort controller

    const role = determineUserRole(formData.email);

    //await new Promise((resolve) => setTimeout(resolve, 10000)); // 10-second delay for debugging

    try {
      //console.log("Submitting login with form data:", formData); // Log form data
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login?role=${role}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          signal: controller.signal, // Link the request to the AbortController
        }
      );

      //console.log("Response status:", response.status);
      const data = await response.json();
      //console.log("Response data:", data); // Log response data

      if (response.status === 200) {
        localStorage.setItem("authorization", `Bearer ${data.authToken}`);
        setLogin();
        getUserDetails(data.authToken);
        navigate(role === "admin" ? "/admin" : "/");
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Login request was aborted.");
      } else {
        console.error("Login error:", err);
        alert(err);
        // toast.error(err.message || "An error occurred!");

      }
    } finally {
      setLoading(false);
      //console.log("Resetting form data:", { email: "", password: "" });
      setFormData({ email: "", password: "", sessionId: "" }); // Reset form data on submit
      closeLoginModal();
    }
  };





  


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
        setUser(userData);
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to fetch user details: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };


  const handleModalClose = () => {
    if (abortController) {
      abortController.abort(); // Cancel the request if the modal is closed
    }
    setLoading(false); // Stop loading
    setFormData({ email: "", password: "" }); // Reset the form data
    closeLoginModal(); // Close the modal
  };


  useEffect(() => {
    const handleModalClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleModalClick);
    return () => {
      document.removeEventListener("mousedown", handleModalClick);
    };
  }, []);

  const handleSignup = () => {
    closeLoginModal();
    openSignupModal();
  };

  const forgotPassword = () => {
    closeLoginModal();
    navigate("/forgot-password");
  };

  // Handling login on pressing enter
  useOnKeyPress(handleSubmit, 'Enter');

  return (
    <div style={{ opacity: 1 }}>
      <div className={styleName} onClick={toggle}>
        {text ? text : "Login"}
      </div>

      <ModalBox
        isOpen={isOpen} toggle={toggle}
        closeModal={closeModal}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        ariaHideApp={false}
      >
        <ModalContent ref={modalRef}>
          {loading ? (<span className="loader"></span>) : ("")}
          <div className="cancel-icon" onClick={closeModal}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>
          <h2 className="form-heading">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter your email*"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="password_container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password*"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                />
              </span>
            </div>
            <div className="forgotPass" onClick={forgotPassword}>
              Forgot Password?
            </div>
            <div className="bottom-contents">
              <button className="hero-button" onClick={handleSubmit} type="submit">
                Login
              </button>
              <div className="bottom-text">
                <p style={{ color: 'black' }}>Don't have an account yet? </p>
                <p onClick={handleSignup}>
                  Create an account
                </p>
              </div>
            </div>
          </form>
        </ModalContent>
      </ModalBox>
    </div>
  );
}