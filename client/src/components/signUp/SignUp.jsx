import Modal from "react-modal";
import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import "./signUp.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import ModalBox from '../ModalBox/ModalBox.tsx'
import useModalToggle from '../ModalBox/useModalToggle.tsx'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useOnKeyPress } from "../../hooks/useOnKeyPress";
import { v4 as uuidv4 } from 'uuid';
// import { toast } from "react-toastify";

// const CustomModal = styled(Modal)`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background-color: rgba(0, 0, 0, 0.5);
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
// `;

const ModalContent = styled.div`
  width: 500px;
  /* z-index: 1000; */
  /* position: fixed; */
  flex-shrink: 0;
  border-radius: 16.477px;
  background: #fff;
  box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 8px;
  display: block;
  z-index:10;
  @media (max-width:600px) {
    width: 90%;
    height:auto;
    padding: 1rem;
    margin: 1rem;
  }
`;
export default function SignUp() {
  const { signupModalIsOpen, closeSignupModal, openLoginModal, openotpModal } =
    useModal();
  const modalRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    Confirmpassword: "",
    location: "",
    businessName: "",
    sessionId: uuidv4()
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const { isOpen, toggle } = useModalToggle();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const closeModal = () => {
    if (abortController) {
      abortController.abort(); 
      console.log('Signup process aborted');
    }
    console.log('closes modal')
    setFormData({
      name: "",
      password: "",
      email: "",
      Confirmpassword: "",
      location: "",
      businessName: "",
      sessionId:""
    })
    //setModalIsOpen(false);
    setLoading(false)
    closeSignupModal()
    toggle()
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (event) => {
    event.preventDefault()
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const determineUserRole = (email) => {
    return email.endsWith("@i-her.org") ? "admin" : "user";
  };

  //Delay function for testing
  // function timeout(delay) {
  //   return new Promise(res => setTimeout(res, delay));
  // }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true);

    const controller = new AbortController();
    setAbortController(controller); 
    
    if (formData.password !== formData.Confirmpassword) {
      alert("Password didn't match");
      // toast("Password didn't match")
      return;
    }

    const role = determineUserRole(formData.email);

    //value is being added before inorder to resolve the location value alert error
    // const locationSelect = document.querySelector("select");
    // const locationValue = locationSelect ? locationSelect.value : '';

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/signup?role=${role}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            location: formData.location,
            businessName: formData.businessName,
            sessionId: uuidv4(),
            signal: controller.signal
          }),
        }
      );

      const data = await response.json();

      if (response.status === 201) {
        localStorage.setItem("authorization", `Bearer ${data.authToken}`);
        // alert(data.message);
        alert(data.message)
        closeSignupModal();
        openotpModal();
      } else {
        //setLoading(false);
        // console.log(data);
        //throw new Error(data.message);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Signup request was aborted.");
      } else {
        console.error("Signup error:", err);
        alert(err);
        // toast.error(err || "An error occurred")
      }
    } finally {
      setLoading(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        Confirmpassword: "",
        location: "",
        businessName: "",
        sessionId: uuidv4()
      });
      closeSignupModal();
    }
  };



  //Handling signup on pressing enter
  useOnKeyPress(handleSubmit, 'Enter');


  useEffect(() => {
    const handleModalClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeSignupModal();
      }
    };
    document.addEventListener("mousedown", handleModalClick);
    return () => {
      document.removeEventListener("mousedown", handleModalClick);
    };
  }, []);


  const handleLogin = () => {
    closeSignupModal();
    openLoginModal();
  };
  return (
    <div>
      {/* <div className={styleName} onClick={openSignupModal}>
        {text ? text : "SignUp"}
      </div> */}

      <ModalBox
        isOpen={signupModalIsOpen}
        onRequestClose={closeModal}
        contentLabel="SignUp Modal"
        ariaHideApp={false}
        closeModal={closeModal}
        toggle={toggle}
      >
        {loading ? (<span className="loader"></span>) : ("")}
        <ModalContent ref={modalRef}>
          <div className="cancel-icon" onClick={closeModal}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </div>
          <div className="form-heading-signUp">Sign Up</div>
          <form className="signup-form">
            <label className="signUp" htmlFor="email">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name*"
              id="MobileNo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="signUp" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email*"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="dropdown">Location</label>
            <select
              id="dropdown"
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="Northern Region">Northern Region</option>
              <option value="Eastern Region">Eastern Region</option>
              <option value="Western Region">Western Region</option>
              <option value="South Western Region">South Western Region</option>
              <option value="West Nile">West Nile</option>
              <option value="Central Region">Central Region</option>
            </select>
            <label className="signUp" htmlFor="email">
              Business Name
            </label>
            <input
              type="text"
              placeholder="Enter your Business Name"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
            />
            <label htmlFor="password" className="signUp">
              Password
            </label>
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
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>

            <label htmlFor="password" className="signUp">
              Retype Password
            </label>
            <div className="password_container">
              <input
                type={showRetypePassword ? "text" : "password"}
                placeholder="Confirm your password*"
                id="passwordConfirm"
                name="Confirmpassword"
                value={formData.Confirmpassword}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle"
                onClick={toggleRetypePasswordVisibility}
              >
                <FontAwesomeIcon icon={showRetypePassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <div className="bottom-contents">
              <button
                className="hero-button signup-btn"
                onClick={handleSubmit}
                type="submit"
              >
                Sign Up
              </button>
              <div className="bottom-text">
                <p style={{ color: 'black' }}>Already have an account? </p>
                <p onClick={handleLogin}>
                  LogIn
                </p>
              </div>
            </div>
          </form>
        </ModalContent>
      </ModalBox>
    </div>
  );
}
