import React, { useState, useEffect } from 'react';
import Day from './Day';
import axios from 'axios';
import API_URL from '../../../hooks/url';
import { useTranslation } from 'react-i18next';

const DaysTable = ({ userId, isMobile }) => {
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth()); 
  const [year, setYear] = useState(new Date().getFullYear()); 
  const { t, i18n} = useTranslation();
  const language = i18n.language;
  
  const months = [
    new Date().getMonth() - 1, 
    new Date().getMonth(), 
    new Date().getMonth() + 1 
  ];

  useEffect(() => {
    fetchDays();
  }, [month, language]); 
 
  const fetchDays = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/days/${userId}?month=${month + 1}&year=${year}&language=${language}`, {
        withCredentials: true
      });
      setDays(response.data);
    } catch (error) {
      console.error('Error fetching days:', error);
    }
  };

  const handleDayDrop = async (updatedDay) => {
    console.log('Updated day:', updatedDay);
    try {
      setDays((prevDays) =>
        prevDays.map((day) =>
          day.number_of_day === updatedDay.number_of_day ? updatedDay : day
        )
      );
      await fetchDays(); 
    } catch (error) {
      console.error('Błąd podczas odświeżania danych:', error);
    }
  };
  
  return (
    <div>
    <div className='month-selector'>
    <label htmlFor="month">{t('selectMonth')}</label>
    <select
      id="month"
      value={month}
      onChange={(e) => setMonth(Number(e.target.value))}
    >
{months.map(m => (
            <option key={m} value={m}>
              {t(`months.${['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][m]}`)}
            </option> 
      ))}
    </select>
  </div>
 
    <div className="table-container">
      
      <table>
        <thead>
          <tr>
            <th>{t('day')}</th>
            <th>{t('breakfast')}</th>
            <th>{t('lunch')}</th>
            <th>{t('dinner')}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <Day key={day.number_of_day} day={day} userId={userId} onDrop={handleDayDrop} onClick={handleDayDrop} isMobile={isMobile} />
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default DaysTable;