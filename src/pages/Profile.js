import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import UserContext from "../UserContext";
import Swal from 'sweetalert2';

export default function Profile() {
    const API_URL = process.env.REACT_APP_API_URL;
    const { user, setUser } = useContext(UserContext);

    const [userName, setUserName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [email, setEmail] = useState('');
    const [info, setInfo] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [noChangeMessage, setNoChangeMessage] = useState('');

    useEffect(() => {
        if (user) {
            setUserName(user.userName || '');
            setMobileNo(user.mobileNo || '');
            setEmail(user.email || '');
            setInfo(user.info || '');
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            // Reset messages
            setError('');
            setSuccessMessage('');
            setNoChangeMessage('');

            const storedUser = localStorage.getItem('user');
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const token = parsedUser?.token;

            if (!token) {
                console.log("No auth token");
                return;
            }

            const trimmedUserName = userName.trim();
            const trimmedEmail = email.trim();
            const trimmedMobileNo = mobileNo.trim();
            const trimmedInfo = info.trim();

            const hasChanges =
                user?.userName !== trimmedUserName ||
                user?.email !== trimmedEmail ||
                user?.mobileNo !== trimmedMobileNo ||
                user?.info !== trimmedInfo;

            if (!hasChanges) {
                setNoChangeMessage('No changes detected.');
                setTimeout(() => setNoChangeMessage(''), 3000); // Auto-clear after 3 seconds
                return;
            }


            if (trimmedMobileNo.length !== 11 || !/^\d{11}$/.test(trimmedMobileNo)) {
                setError('Mobile number must be exactly 11 digits');
                return;
            }

            const response = await fetch(`${API_URL}/users/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    userName: trimmedUserName,
                    email: trimmedEmail,
                    mobileNo: trimmedMobileNo,
                    info: trimmedInfo
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Update failed");
            }

            const updatedUser = {
                ...parsedUser,
                userName: trimmedUserName,
                email: trimmedEmail,
                mobileNo: trimmedMobileNo,
                info: trimmedInfo
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccessMessage('Profile updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error("Update failed:", err.message);
            alert(err.message || 'Something went wrong.');
        }
    };

    return (
        <>
            <div className="mt-5 container">
                <Row>

                    <h2 className="d-flex justify-content-center mb-5">Profile Information</h2>
                </Row>
            </div>

            {/* Avatar Box */}
            {/* Avatar Box */}
            <div className="d-flex justify-content-center mb-4">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="Avatar"
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: '2px solid #ccc'
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: 120,
                            height: 120,
                            backgroundColor: '#ddd',
                            borderRadius: '10px'
                        }}
                    />
                )}
            </div>


            {/* Form */}
            <Row className="justify-content-center">
                <Col md={4}>
                    {/* Username */}
                    <div className="input-group mb-3">
                        <span className="input-group-text"><FaUser /></span>
                        <Form.Control
                            placeholder="Username"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                        />
                    </div>

                    {/* Mobile No */}
                    <div className="input-group mb-3">
                        <span className="input-group-text"><FaPhone /></span>
                        <Form.Control
                            placeholder="Mobile No"
                            value={mobileNo}
                            onChange={e => setMobileNo(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div className="input-group mb-3">
                        <span className="input-group-text"><FaEnvelope /></span>
                        <Form.Control
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Info */}
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Info"
                            value={info}
                            onChange={e => setInfo(e.target.value)}
                            style={{ borderRadius: '15px' }}
                        />
                    </Form.Group>

                    {/* Messages */}
                    {successMessage && (
                        <div className="text-success"><p>{successMessage}</p></div>
                    )}
                    {error && (
                        <div className="text-danger"><p>{error}</p></div>
                    )}
                    {noChangeMessage && (
                        <div className="text-secondary"><p>{noChangeMessage}</p></div>
                    )}

                    {/* Submit Button */}
                    <div className="d-grid">
                        <Button className="btn bg-success" onClick={handleUpdate}>Update</Button>
                    </div>
                </Col>
            </Row>
        </>
    );
}
