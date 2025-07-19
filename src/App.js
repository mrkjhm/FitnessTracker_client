// React
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
// BS
import { Container } from 'react-bootstrap';
// CSS
import './App.css';
import './index.css'
// UserContext
import { UserProvider } from './UserContext';
// Components
import AppNavbar from './components/AppNavbar';
// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Workout from './pages/Workout';
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";




function App() {


  useEffect(() => {
    // Create a new instance of the Lenis library.
    // Lenis is often used for smooth scrolling, so this initializes it to handle the scroll behavior.
    const lenis = new Lenis();

    // Define a recursive function called 'raf' (requestAnimationFrame)
    // This function will be used to update the scroll position in the next animation frame
    function raf(time) {
      // The 'lenis.raf(time)' method is called on each frame to update the scroll position.
      // The 'time' parameter is the current timestamp provided by the browser during the animation frame.
      lenis.raf(time);

      // After processing the current frame, we request the next animation frame to continue the smooth scrolling.
      // This makes the scroll behavior smooth and continuous.
      requestAnimationFrame(raf); // Recurse: call 'raf' again for the next animation frame
    }

    // Start the recursive animation loop by calling 'requestAnimationFrame' for the first time.
    // This will trigger the 'raf' function to begin and loop indefinitely, creating smooth scrolling.
    requestAnimationFrame(raf);

    // Empty dependency array ensures this effect only runs once when the component is mounted.
    // It doesn't re-run unless the component is unmounted and remounted.
  }, []); // The empty array means it runs once when the component mounts




  return (
      <UserProvider>
        <Router>
          <AppNavbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route element={<ProtectedRoute />} >
              <Route path='/workout' element={<Workout />} />
            </Route>
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </UserProvider>
  );
}

export default App;
