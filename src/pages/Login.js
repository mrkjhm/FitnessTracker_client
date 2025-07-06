import { useContext, useState, useEffect } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {

    const API_URL = process.env.REACT_APP_API_URL;

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user?.id) {
            navigate('/workout');
        }
    }, [navigate, user]);

    const handleRegisterClick = () => {
        navigate('/register');
    };

    function authentication(e) {
        e.preventDefault();
        fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include', // Include cookies for CORS
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Email and password do not match") {
                    Swal.fire({
                        title: "Login Fail",
                        icon: "warning",
                        text: "Email and password do not match"
                    });
                } else {
                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);

                    navigate('/workout');

                    Swal.fire({
                        title: "Login Successful",
                        icon: "success",
                        text: "Welcome to Fitness Club!"
                    });
                }
            })
            .catch(err => {
                console.error("Login error:", err);
                Swal.fire({
                    title: "Login Error",
                    icon: "error",
                    text: "Failed to connect to the server."
                });
            });

        setEmail('');
        setPassword('');
    }

    const retrieveUserDetails = (token) => {
        fetch(`${API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            credentials: 'include' // Include cookies for CORS
        })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser({
                        id: data.user._id,
                        isAdmin: data.user.isAdmin
                    });
                } else {
                    setUser({ id: null, isAdmin: null });
                    console.warn("User data not found in token response");
                }
            })
            .catch(err => {
                console.error("User fetch error:", err);
                setUser({ id: null, isAdmin: null });
            });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Form onSubmit={(e) => authentication(e)} className='col-lg-5 col-10'>
                <h1 className="mb-4">Login</h1>
                <Form.Group controlId="userEmail" className='pb-2'>
                    <FloatingLabel controlId="floatingInput" label="Email address">
                        <Form.Control
                            type="email"
                            placeholder="Enter address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="password" className='pb-2'>
                    <FloatingLabel controlId="floatingPassword" label="Password">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FloatingLabel>
                </Form.Group>

                <Button variant="danger" type="submit" id="gradient-button" className=' col-12 p-2'>
                    Login
                </Button>
                <p className='mt-4'>Don't have an account? <span id="register" onClick={handleRegisterClick}><strong>Register</strong></span></p>
            </Form>
        </div>
    );
}
