import React, { useContext, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import UserContext from '../UserContext';  // Assuming you have UserContext set up


import img_2 from '../assets/img-2.jpg';
import img_3 from '../assets/img-3.jpg';
import img_4 from '../assets/img-4.jpg';


const Hero = forwardRef((props, ref) => {
    const { user } = useContext(UserContext);  // Get the user from context

    return (

        <div className='container text-lg-start text-center' id="get-started-section" ref={ref}>
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                <div className="col-12 col-sm-12 col-lg-6">
                    <Carousel>
                        <Carousel.Item>
                            <img src={img_2} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={img_3} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img src={img_4} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
                        </Carousel.Item>
                    
                    </Carousel>
                </div>
                {/* Attach the ref to the get-started section */}
                <div className="col-lg-6" >  
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Welcome to Fitness Club</h1>
                    <p className="lead">Reach your fitness goals easily with our simple tracker. Set goals, track calories, and see your progress in real-time. Custom plans and insights make hitting your targets easier than ever!</p>
                    <div className="d-grid gap-2 d-flex justify-content-lg-start justify-content-center mt-4">
                        <Link className="btn btn-danger btn-lg px-4 me-md-2" id="gradient-button-home" to={user.id ? "/workout" : "/login"}>
                            {user.id ? "View Your Progress" : "Get Started"} <span className="ms-3"><FontAwesomeIcon icon={faArrowRight} /></span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Hero;
