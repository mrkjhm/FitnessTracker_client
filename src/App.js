// React
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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



function App() {
  return (
    <UserProvider>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/workout' element={<Workout />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
