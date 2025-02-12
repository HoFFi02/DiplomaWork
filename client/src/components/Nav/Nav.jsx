import React from 'react';
import '../../css/nav.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from "axios";
import API_URL from '../../hooks/url';
import { useTranslation } from 'react-i18next';

const Nav = () => {
  const { t } = useTranslation();
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true
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
        <ion-icon name="restaurant-outline"></ion-icon>
        <div className='controls-nav'>

          <Link to="/home" className='link'><p> {t('home')}</p></Link>
          <Link to="/plan" className='link'><p> {t('plan')}</p> </Link>
          <Link to="/shopping_list" className='link'><p> {t('shoppingList')}</p></Link>
          <p onClick={handleLogout}> {t('logout')}</p>
        </div>
      </nav>
    </>
  )
}

export default Nav