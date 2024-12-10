import React, { useState } from 'react'
import "./forgotPass.css"
import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';

export default function ForgotPass() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [pass, setpass] = useState('');
  const [confirmpass, setconfirmpass] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/query/forgot-password`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();
      //console.log(data)
      if (response.ok) {
        alert(data.message);
        // toast.success(data.message, {
        //   position: "bottom-right"
        // })

        localStorage.setItem("authorization", `Bearer ${data.authToken}`);
      } else {
        console.err(`Failed to send OTP: ${data.message}`);
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
    setStep(2);
  };

  const handleOTPSubmit = async (e) => {
    if (pass === confirmpass) {

      e.preventDefault();
      const authToken = localStorage.getItem('authorization')
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/query/set-password`, {
          method: 'POST',
          headers: {
            authorization: `${authToken}`,
            "Content-Type": "application/json",

          },
          body: JSON.stringify({
            newPassword: pass,
            OTP: otp
          }),
        });

        const data = await response.json();
        //console.log(data)
        if (response.ok) {
          alert(data.message);
          // toast.success(data.message, {
          //   position: 'bottom-right'
          // })
          navigate("/")
        } else {
          console.err(`Failed to set new password: ${data.message}`);
        }
      } catch (err) {
        console.error('Failed to set new password:', err);
      }
    }
    else {
      alert("Password doesn't match")
      // toast.error("Error Notification !", {
      //   position: "bottom-right"
      // });
    }
  };

  return (
    <div className='form-box'>{step === 1 && (
      <form onSubmit={handleEmailSubmit} className='form'>
        <h2 className='heading forgot'>Forgot Password</h2>
        <label>Email:</label>
        <input className='input-box'
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className='center'>

          <button className='button login-button' type="submit">Send OTP</button>
        </div>
      </form>
    )}
      {step === 2 && (
        <form onSubmit={handleOTPSubmit} className='form'>
          <h2 className='heading'>Verify OTP</h2>
          <label>Enter OTP:</label>
          <input
            className='input-box'
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
          />
          <label>New Password</label>
          <input
            className='input-box'
            type="text"
            value={pass}
            onChange={(e) => setpass(e.target.value)}
            required
          />
          <label> Confirm New Password</label>
          <input
            className='input-box'
            type="text"
            value={confirmpass}
            onChange={(e) => setconfirmpass(e.target.value)}
            required
          />
          <div className='center'>

            <button className='button login-button shift' type="submit">Verify OTP</button>
          </div>
        </form>
      )}
    </div>
  )
}
