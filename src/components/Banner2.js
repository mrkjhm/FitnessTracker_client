import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import UserContext from '../UserContext';  // Assuming you have UserContext set up

import videoBg from '../assets/videoBg.mp4';
import img1 from '../assets/img1.jpg';

export default function Banner2({ scrollToSection }) {
  const { user } = useContext(UserContext);  // Get the user from context
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle button click
  const handleButtonClick = () => {
    if (user && user.id) {
      // User is logged in, navigate to a specific route (e.g., dashboard)
      navigate('/workout'); // Change this to your desired route
    } else {
      // User is not logged in, scroll to a specific section
      scrollToSection();
    }
  };

  return (
    <div className="banner no-padding">
      <img src={img1} alt="" className="video-bg" />
      <div className='content'>
        <div className="col-lg-8 col-10">
          <h1 className="display-5 fw-bold mb-4 text-center lh-1" id="title">
            <span className="text-danger"><strong><em>SCULPT YOUR</em></strong></span>
            <br />
            <span className="text-white"><strong><em>BEST BODY</em></strong></span>
          </h1>
          <div className="d-grid gap-2 d-flex justify-content-center mt-4">
            <button 
              className="btn btn-danger btn-lg px-4 me-md-2" 
              id="gradient-button-home" 
              onClick={handleButtonClick} // Use the new function
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
      <div className="bg-overlay"></div>
    </div>
  );
}
