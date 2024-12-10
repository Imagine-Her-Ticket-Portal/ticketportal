import React, { useState, useEffect } from "react";
import "./profile.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import { useNavigate } from "react-router-dom";
import TicketSummary from "../ticketSummary/TicketSummary";
// import { toast } from "react-toastify";

export default function Profile() {
  const { user, setLogout, openotpModal } = useModal();
  const { name, email, location, businessName } = user;
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userBusiness, setUserBusiness] = useState('');
  const [editedUser, setEditedUser] = useState();

  const locations = [
    "Northern Region",
    "Eastern Region",
    "Western Region",
    "South Western Region",
    "West Nile",
    "Central Region",
  ];

  const logout = () => {
    setLogout();
    localStorage.clear();
    navigate("/");
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
    setEditedUser({ ...editedUser, name: e.target.value });
  };

  const handleLocationChange = (e) => {
    setUserLocation(e.target.value);
    setEditedUser({ ...editedUser, location: e.target.value });
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    setEditedUser({ ...editedUser, email: e.target.value });
  };

  const handleBusinessNameChange = (e) => {
    setUserBusiness(e.target.value);
    setEditedUser({ ...editedUser, businessName: e.target.value });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setUserName(name);
    setUserLocation(location);
    setUserEmail(email);
    setUserBusiness(businessName);
  };

  const handleProfileChanges = async () => {
    const authToken = localStorage.getItem("authorization");
    let bodyData = {
      name: userName,
      email: userEmail,
      location: userLocation,
      businessName: userBusiness
    };

    if (userName === name && userEmail === email && userLocation === location && userBusiness === businessName) {
      alert("No changes detected");
      // toast("No changes detected")
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/profile-update`,
        {
          method: "POST",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // toast.success(data.message)
        setIsEditing(false);
        window.location.reload();
      } else {
        console.error(`Failed to update profile changes: ${data.message}`);
        alert(data.message);
        // toast.error(data.message || "An error occurred")
      }
    } catch (err) {
      console.error("Error updating profile changes:", err);
    }
  };

  const handleDeleteUser = async () => {
    const authToken = localStorage.getItem("authorization");
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Use 'PATCH' for soft delete, 'DELETE' for hard delete
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/user/${user._id}/soft-delete`, // or use hard-delete endpoint
          {
            method: "PATCH", // Use "DELETE" for hard delete
            headers: {
              Authorization: authToken,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          // toast.success(data.message)
          setLogout(); // Perform any necessary logout operations
          localStorage.clear();
          navigate("/"); // Redirect to home or login page
        } else {
          console.error(`Failed to delete user: ${data.message}`);
          alert(data.message);
          // toast.error(data.message || "An error occurred")
        }
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };


  const handlesendOTP = async () => {
    const authToken = localStorage.getItem("authorization");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/otp/resend`, {
        method: "PATCH",
        headers: {
          Authorization: authToken,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // toast.success(data.message)
      } else {
        console.error(`Failed to send OTP: ${data.message}`);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
    }
  };

  const handleVerify = () => {

    if (!user.verified) {
      user.role === "client" ? navigate("/") : navigate("/admin");
      openotpModal();
      handlesendOTP();
    }
  };

  return (
    <>

      <div className="profile_pages">
        <div className="container-profile">
          <div className="profile-details">
            {isEditing ? (
              <>
                <div>
                  <div className="name">
                    <div className="title">Name</div>
                    <input
                      className="name-box"
                      placeholder={user.name}
                      type="text"
                      name="name"
                      value={userName}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="name">
                    <div className="title">Email</div>
                    <input
                      className="name-box"
                      placeholder={user.email}
                      type="email"
                      name="email"
                      value={userEmail}
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className="name">
                    <div className="title">Location</div>
                    <select className='name-box' name="location" value={userLocation} onChange={handleLocationChange}>
                      <option key={new Date().getTime()} value={location}>{location}</option>
                      {locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div className="name">
                    <div className="title">Business Name</div>
                    <input
                      className="name-box"
                      placeholder={user.businessName}
                      type="text"
                      name="businessName"
                      value={userBusiness}
                      onChange={handleBusinessNameChange}
                    />
                  </div>
                </div>

              </>
            ) : (
              <>
                <div className="profile-cont">
                  <h1>{userName === '' ? user.name : userName}</h1>
                  <h5>{userEmail === '' ? user.email : userEmail}</h5>
                  <div>{userLocation === '' ? user.location : userLocation}</div>
                  <div>{(userBusiness === '' || userBusiness === null) ? user.businessName : userBusiness}</div>
                <TicketSummary/>
                </div>
                    
             </>
            )}
          </div>
          <div className="buttons">
            {isEditing ? (
              <>
                <button
                  className="hero-button"
                  onClick={handleProfileChanges}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  className="hero-button"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              </>
            )}
            {user && !user.verified && (
              <button className="hero-button" onClick={handleVerify}>
                Verify
              </button>
            )}
            <button className="hero-button" onClick={logout}>
              LogOut
            </button>
            <button className="delete-button" onClick={handleDeleteUser}>
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </>
  );

};
