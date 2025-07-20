import { useState, useEffect, useContext, useRef } from 'react';
import { Form, Button, FloatingLabel,  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

    const API_URL = process.env.REACT_APP_API_URL;

    const fileInputRef = useRef(null);

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [info, setInfo] = useState("")
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState(null)

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);


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
        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("email", email);
        formData.append("mobileNo", mobileNo);
        formData.append("info", info);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);

        if (avatar) {
            formData.append('avatar', avatar); // avatar is a File object already
        }



        fetch(`${API_URL}/users/register`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setIsLoading(false); // ✅ stop loading after response

                if (data.message === "Registered Successfully") {
                    setUserName('');
                    setMobileNo('');
                    setInfo('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setAvatar(null);
                    if (fileInputRef.current) fileInputRef.current.value = null;


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

    const handleRemoveAvatar = () => {
        setAvatar(null);
    }


    return (
        <>
            <div className='container d-flex justify-content-center align-items-center' style={{ minHeight: '90vh' }}>
                <Form onSubmit={(e) => registerUser(e)} className='col-lg-5 col-10'>
                    <h1 className=" mb-4">Register</h1>

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
                        <FloatingLabel controlId="floatingTextarea" label="Short Info">
                            <Form.Control
                                as="textarea"
                                placeholder="Short Info"
                                style={{ height: '100px' }} // optional: adjust height
                                value={info}
                                onChange={e => setInfo(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>


                    <Form.Group className="pb-2" style={{ position: 'relative' }}>
                        <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control
                                type={showPassword1 ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <div
                            onClick={() => setShowPassword1(prev => !prev)}
                            style={{
                                position: 'absolute',
                                right: 15,
                                top: 10,
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </Form.Group>


                    <Form.Group className="pb-2" style={{ position: 'relative' }}>
                        <FloatingLabel controlId="floatingConfirmPassword" label="Confirm Password">
                            <Form.Control
                                type={showPassword2 ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                        <div
                            onClick={() => setShowPassword2(prev => !prev)}
                            style={{
                                position: 'absolute',
                                right: 15,
                                top: 10,
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >
                            {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </Form.Group>


                    <Form.Group className="pb-2">
                        <Form.Label>Upload Avatar</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setAvatar(e.target.files[0])}
                            ref={fileInputRef}
                        />
                    </Form.Group>

                    {avatar && (
                        <div className="mt-3 mb-3">
                            <img
                                src={URL.createObjectURL(avatar)}
                                alt="Avatar Preview"
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10 }}
                            />
                        </div>
                    )}




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