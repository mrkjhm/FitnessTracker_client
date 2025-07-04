import { useState, useEffect, useContext } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

    const API_URL = process.env.REACT_APP_API_URL;
    const handleLoginClick = () => {
        navigate('/login')
    }

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);


    useEffect(() => {

        if ((userName !== "" && mobileNo !== "" && email !== "" && password !== '' && confirmPassword !== "") && (password === confirmPassword)) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }

        if (user.id) {
            navigate('/workout')
        }

    }, [email, password, confirmPassword, navigate, user.id])



    function registerUser(e) {

        e.preventDefault();

        fetch(`${API_URL}/users/register`, {

            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: userName,
                email: email,
                password: password,
                mobileNo: mobileNo,
                confirmPassword: confirmPassword

            })
        })
            .then(res => res.json())
            .then(data => {

                //determine the returned data. Especially useful when the given API is online.
                console.log(data);

                //data will only contain an email property if we can properly save our user.
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

                }

            })
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
                                type="number"
                                placeholder="Modile No."
                                value={mobileNo}
                                onChange={e => { setMobileNo(e.target.value) }}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <FloatingLabel controlId="floatingInput" label="Password">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => { setPassword(e.target.value) }}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <FloatingLabel controlId="floatingInput" label="Confirmed Password">
                            <Form.Control
                                type="password"
                                placeholder="Confirmed Password"
                                value={confirmPassword}
                                onChange={e => { setConfirmPassword(e.target.value) }}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>







                    <Button variant="danger" type="submit" className=' col-12 p-2' id="gradient-button">Register</Button>

                    <p className='mt-4'>Already have an Account? <span id='login' onClick={handleLoginClick}><strong>Login</strong></span></p>

                </Form>
            </div>
        </>

    )
}