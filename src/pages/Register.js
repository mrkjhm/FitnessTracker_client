import { useState, useEffect, useContext } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

    const API_URL = process.env.REACT_APP_API_URL;

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginClick = () => {
        navigate('/login')
    }

    useEffect(() => {
        if (user.id) {
            navigate('/workout')
        }
    }, [navigate, user.id])



    function registerUser(e) {
        e.preventDefault();

        // Validations
        if (!email.includes('@')) {
            return Swal.fire({ title: "Invalid Email", icon: "error", text: "Please enter a valid email address." });
        }

        if (mobileNo.length !== 11) {
            return Swal.fire({ title: "Invalid Mobile No.", icon: "error", text: "Mobile number must be 11 digits." });
        }

        if (password.length < 8) {
            return Swal.fire({ title: "Weak Password", icon: "error", text: "Password must be at least 8 characters long." });
        }

        if (password !== confirmPassword) {
            return Swal.fire({ title: "Password Mismatch", icon: "error", text: "Passwords do not match." });
        }

        setIsLoading(true); // ✅ start loading state

        fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName,
                email,
                password,
                mobileNo,
                confirmPassword
            })
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false); // ✅ stop loading after response

                if (data.message === "Registered Successfully") {
                    setUserName('');
                    setMobileNo('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');

                    Swal.fire({
                        title: "Registration Successful",
                        icon: "success",
                        text: "Thank you for registering!"
                    });
                } else {
                    Swal.fire({ title: "Error", icon: "error", text: data.message || "Registration failed" });
                }
            })
            .catch(() => {
                setIsLoading(false); // ✅ also stop loading on error
                Swal.fire({ title: "Error", icon: "error", text: "Something went wrong. Please try again." });
            });
    }



    return (
        <>
            <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
                <Form onSubmit={(e) => registerUser(e)} className='col-lg-5 col-10'>
                    <h2 className=" mb-4">Register</h2>

                    <Form.Group className='pb-2'>
                        <FloatingLabel controlId="floatingInput" label="Username">
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={userName}
                                onChange={e => { setUserName(e.target.value) }}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <FloatingLabel controlId="floatingInput" label="Email address">
                            <Form.Control
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={e => { setEmail(e.target.value) }}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <FloatingLabel controlId="floatingInput" label="Mobile No.">
                            <Form.Control
                                type="tel"
                                pattern="[0-9]{11}"
                                maxLength={11}
                                value={mobileNo}
                                onChange={e => setMobileNo(e.target.value.replace(/\D/, ''))}
                                required
                            />
                        </FloatingLabel>
                        <Form.Text className="text-muted ms-2" style={{ fontSize: '12px' }}>
                            Enter 11-digit mobile number (e.g., 09171234567)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <FloatingLabel controlId="floatingInput" label="Password">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <FloatingLabel controlId="floatingInput" label="Confirm Password">
                            <Form.Control
                                type="password"
                                placeholder="Confirmed Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Button
                        variant="danger"
                        type="submit"
                        className='col-12 p-2'
                        id="gradient-button"
                        // disabled={!isActive || isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </Button>

                    <p className='mt-4'>Already have an Account? <span id='login' onClick={handleLoginClick}><strong>Login</strong></span></p>

                </Form>
            </div>
        </>

    )
}