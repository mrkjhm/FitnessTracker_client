import { useContext, useState, useEffect } from 'react';
import { Form, Button, FloatingLabel } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Login() {

    const API_URL = process.env.REACT_APP_API_URL;

    const handleRegisterClick = () => {
        navigate('/register')
    }

	const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);


    useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        } else {
            setIsActive(false);
        }

        if (user?.id) {
            navigate('/workout');
        }

    }, [email, password, navigate, user])


    function authentication(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
		fetch(`${API_URL}/users/login`,{

		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({

			email: email,
			password: password

		})
	})
	.then(res => res.json())
	.then(data => {

        // console.log(data)
        console.log("Login API Response:", data);

        if (data.message === "Email and password do not match") {
            Swal.fire({
                title: "Login Fail",
                icon: "warning",
                text: "Email and password do not match"
            });

        }else{
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

	setEmail('');
	setPassword('');

    }

    const retrieveUserDetails = (token) => {
    fetch(`${API_URL}/users/details`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Login Retrieved User:", data);

        if (data.user) {
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            });
        } else {
            // Optional fallback to avoid state errors
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
        
    )
}