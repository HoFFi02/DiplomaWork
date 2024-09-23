import React from 'react';
import '../../css/nav.css';
import { BrowserRouter as Router, Route, Routes, Link  } from 'react-router-dom';
import axios from "axios";


const Nav = () => {

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true // Wysyłanie ciasteczek sesji
      });
      if (response.status === 200) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };


  return (
    <>
    <nav>
      <div className='all-logo'></div>
        <b></b>
      <div className='controls-nav'>
        
        <Link to="/home"><p> Home</p></Link>
        <p> Plan</p>
        <Link to="/shopping_list" ><p> Shopping list</p></Link>
        <p onClick={handleLogout}> Logout</p>
      </div>
    </nav>
    </>
  )
}

export default Nav