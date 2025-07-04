import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext, useRef } from 'react';
import UserContext from '../UserContext';
import Banner from '../components/Banner';
import Banner2 from '../components/Banner2';
import Benefit from '../components/Benefit';
import Hero from '../components/Hero';


export default function Home() {


    const getStartedRef = useRef(null);

  const scrollToSection = () => {
    if (getStartedRef.current) {  // Make sure the ref is not null
      getStartedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

    return (
        <>
        <div>
   
        <Banner2 scrollToSection={scrollToSection} />
        <Hero ref={getStartedRef} />
        {/* <Benefit /> */}
        {/* <Benefit /> */}
        
        

        </div>
      
        {/* <Row>
            <Col className="p-4 text-center">
                <h1>Welcome To Fitnesssssssss</h1>
                <p></p>
                <Link className="btn btn-primary" to={ user.id ? '/workout' : 'login' }>Check Your Workout</Link>
            </Col>
        </Row> */}
        </>
    )
}