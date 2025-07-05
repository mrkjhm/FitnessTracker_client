import { useRef } from 'react';
import Banner2 from '../components/Banner2';
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
            </div>
        </>
    )
}