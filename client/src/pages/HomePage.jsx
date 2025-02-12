import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import useUser from '../hooks/useUser';
import Nav from '../components/Nav/Nav';
import HomeForm from '../components/Home/HomeForm';
import LanguageSwitcher from '../hooks/LanguageSwitcher.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import API_URL from '..//hooks/url';
import { useTranslation } from 'react-i18next';

function HomePage() {
  const { user } = useUser();
  const isMobile = window.innerWidth<768;
  const Backend = isMobile ? TouchBackend : HTML5Backend; 
  const options = {
    delayTouchStart : 100
  }
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
  const [tooltipVisible, setTooltipVisible] = useState(false); 
  const toggleTooltip = () => setTooltipVisible(!tooltipVisible);

  return (
    <div className='page'>
      <Nav />
      <div className='lang-info'>
      <div className="tooltip-container">
                <button className="info-button" onClick={toggleTooltip}>?</button>
                {tooltipVisible && (
                  <span className="tooltip-text">{t('dragAndDropInstruction')}</span>
                )}
      </div>
      <LanguageSwitcher />
      </div>
      <DndProvider backend={Backend} options={options}>
        <HomeForm user={user} onLogout={handleLogout} isMobile={isMobile} />
      </DndProvider>
    </div>
  );
}

export default HomePage;