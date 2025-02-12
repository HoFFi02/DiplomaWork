
import React, { useState, useEffect } from 'react';
import Plan from './Plan';
import axios from 'axios';
import API_URL from '../../hooks/url';
import { useTranslation } from 'react-i18next';

const PlanTable = ({ userId }) => {
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
  }, [month, year, language]); 
  
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

  const handleDayDrop = (updatedDay) => {
    console.log('Updated day:', updatedDay);
    
    setDays((prevDays) =>
      prevDays.map((day) => (day.number_of_day === updatedDay.number_of_day ? updatedDay : day))
    );
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
 
    <div className="plan-table-container">
      
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
            <Plan key={day.number_of_day} day={day} userId={userId} onClick={handleDayDrop} />
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default PlanTable;
