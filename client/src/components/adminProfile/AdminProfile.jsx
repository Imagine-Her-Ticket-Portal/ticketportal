import React, { useState, useEffect } from "react";
import "./AdminProfile.scss";
import { useModal } from "../../modalProvider/Modalprovider";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

export default function AdminProfile() {
    const { user, setLogout, openotpModal } = useModal();
    const { name, email, location } = user;
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [editedUser, setEditedUser] = useState();

    useEffect(() => {
        setUserData(user);
    }, [user]);

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

    const handleEditProfile = () => {
        setIsEditing(true);
        setUserName(name);
        setUserLocation(location);
        setUserEmail(email);
    };

    const handleProfileChanges = async () => {
        const authToken = localStorage.getItem("authorization");
        setEditedUser(editedUser);
        let bodyData;
        if (user && user.role === "client") {
            bodyData = {
                name: userName,
                email: userEmail,
                location: userLocation
            };
        } else {
            bodyData = {
                name: userName,
                email: userEmail,
                location: userLocation
            };
        }

        if (userName === name && userEmail === email && userLocation === location) {
            alert("No changes detected");
            // toast.error( "No changes detected");
            window.location.reload();
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
                    body: JSON.stringify({
                        name: userName,
                        email: userEmail,
                        location: userLocation
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                // toast.error(data.message || "An error occurred!");
                window.location.reload();
            } else {
                console.error(`Failed to update profile changes: ${data.message}`);
            }
        } catch (err) {
            console.error("Error updating profile changes:", err);
        }
        setEditedUser({ user });
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
                // toast.error(data.message || "An error occurred!");
            } else {
                console.error(`Failed to send OTP: ${data.message}`);
            }
        } catch (err) {
            console.error("Error sending OTP:", err);
        }
    };

    const handleVerify = () => {
        if (!user.verified) {
            navigate("/");
            openotpModal();
            handlesendOTP();
        }
    };

    const handleDeleteAdmin = async () => {
        const authToken = localStorage.getItem("authorization");
        if (window.confirm("Are you sure you want to delete this admin?")) {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/admin/${user._id}/soft-delete`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    // toast.success(data.message)
                    logout();
                    localStorage.clear();
                    navigate("/");
                } else {
                    console.error(`Failed to delete admin: ${data.message}`);
                    alert(data.message);
                    // toast.error(data.message || "An error occurred!");
                }
            } catch (err) {
                console.error("Error deleting admin:", err);
            }
        }
    };

    const handlePendingTickets = () => {
        navigate('/admin');
    };

    const handleOtherTickets = () => {
        navigate('/admin/ticket-history');
    };

    return (
        <>
            <div className="profile_page">
                <div className="container-profile-admin">
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
                                            {
                                                locations.map((location, index) => (
                                                    <option key={index} value={location}>{location}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="profile-cont">
                                    <h1>{userName === '' ? user.name : userName}</h1>
                                    <h5>{userEmail === '' ? user.email : userEmail}</h5>
                                    <div>{userLocation === '' ? user.location : userLocation}</div>
                                    {
                                        userData !== null && (
                                            <>
                                                <div className="stats">
                                                    <div className="stat-box primary-stat" onClick={handleOtherTickets}>
                                                        <h1>{userData.ticketInReview.length}</h1>
                                                        <p>In Review</p>
                                                    </div>
                                                    <div className="stat-box" onClick={handleOtherTickets}>
                                                        <h1>{userData.ticketResolved.length}</h1>
                                                        <p>Resolved</p>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
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
                                    className="btn-secondary"
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
                        {/* Admin Delete Button */}
                        {user && user.role !== "client" && (
                            <button className="delete-button" onClick={handleDeleteAdmin}>
                                Delete Admin
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
