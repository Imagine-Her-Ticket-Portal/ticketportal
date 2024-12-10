import Modal from "react-modal";
import styled from "styled-components";
import React, { useRef, useEffect, useState } from "react";
import { useModal } from "../../modalProvider/Modalprovider";
import "./otp.css";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

const CustomModal = styled(Modal)`
  display: flex;
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
  height: 370px;
  flex-shrink: 0;
  border-radius: 16.477px;
  background: #fff;
  box-shadow: 0px 4px 28px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 8px;
  display: block;
  @media (max-width:690px) {
    width:250px;
    height:260px;
    padding: 5px;
}
`;
export default function Otp(props) {
  const notSign = props.notsignin;
  const navigate = useNavigate()
  const [otp, setotp] = useState("")
  const { otpModalIsOpen, openLoginModal, openSignupModal, closeotpModal } =
    useModal();

  const modalRef = useRef();

  const [timer, setTimer] = useState(300);

  const handleBack = () => {
    closeotpModal();
    openSignupModal();
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authorization');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/otp/verify`, {
        method: "PATCH",
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          OTP: otp
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message)
        // toast.success(data.message || "succesfull")
        window.location.reload();
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to verify: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Error verifying user email:", err);
    }
    setotp("")
    closeotpModal();
    !notSign && openLoginModal();
  };

  const handleResendOTP = async () => {
    const authToken = localStorage.getItem('authorization');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/otp/resend`, {
        method: 'PATCH',
        headers: {
          Authorization: authToken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // toast.success(data.message || "successfull")
      } else {
        console.err(`Failed to resend OTP: ${data.message}`);
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
    }
    setTimer(300)
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleOtpChange = (event) => {
    const { name, value } = event.target;
    setotp((prevOtp) => {
      const updatedOtp = [...prevOtp];
      const index = parseInt(name.slice(-1), 10);

      if (!isNaN(index) && index >= 1 && index <= 6) {
        updatedOtp[index - 1] = value;

        if (value.length === 1 && index < 6) {
          const nextInput = document.querySelector(`input[name=otp${index + 1}]`);
          if (nextInput) {
            nextInput.focus();
          }
        }
      }

      return updatedOtp.join('').slice(0, 6);
    });
  };

  useEffect(() => {
    let interval;

    if (otpModalIsOpen) {
      interval = setInterval(() => {
        if (timer > 0) {
          setTimer((prevTimer) => prevTimer - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [otpModalIsOpen, timer]);

  useEffect(() => {
    if (otpModalIsOpen) {
      setTimer(300); // Reset the timer when the modal is opened
    }
  }, [otpModalIsOpen]);

  const handleHome = () => {
    closeotpModal();
    navigate("/")
  }


  return (
    <div>
      <CustomModal
        isOpen={otpModalIsOpen}
        onRequestClose={closeotpModal}
        contentLabel="Login Modal"
        ariaHideApp={false}
      >
        <ModalContent ref={modalRef}>
          <h2 className="form-heading">Verify</h2>
          <h5 className="center">Time remaining : {formatTime(timer)}</h5>
          <form>
            <div class="otp-field mb-4">
              <input type="number"

                name="otp1"
                value={otp.charAt(0) || ""}
                onChange={handleOtpChange} />
              <input type="number"
                name="otp2"
                value={otp.charAt(1) || ""}
                onChange={handleOtpChange} />
              <input type="number"
                name="otp3"
                value={otp.charAt(2) || ""}
                onChange={handleOtpChange} />
              <input type="number"
                name="otp4"
                value={otp.charAt(3) || ""}
                onChange={handleOtpChange} />
              <input type="number"
                name="otp5"
                value={otp.charAt(4) || ""}
                onChange={handleOtpChange} />
              <input type="number"
                name="otp6"
                value={otp.charAt(5) || ""}
                onChange={handleOtpChange} />
            </div>
            <div className="buttons2">
              {!notSign &&
                <div
                  className="button login-button otp-button"
                  onClick={handleBack}
                  type="submit"
                >
                  Go Back
                </div>
              }
              {notSign &&
                <div
                  className="button login-button otp-button"
                  onClick={handleHome}

                >
                  Home
                </div>
              }
              <div
                className="btn-primary login-button otp-button"
                onClick={handleVerify}
                type="submit"
              >
                Verify
              </div>
            </div>
            <div className="new-account">Didn't receive a code? </div>
            <div className="forgotPass create-acc" onClick={handleResendOTP}>Request OTP</div>
          </form>
        </ModalContent>
      </CustomModal>
    </div>
  );
}
