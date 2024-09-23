import React, { useState, useEffect } from 'react';
import Day from './Day';
import axios from 'axios';

const DaysTable = ({ userId }) => {
  const [days, setDays] = useState([]);

  useEffect(() => {
    fetchDays();
  }, []);

  const fetchDays = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/days', {
        withCredentials: true
      });
   
      setDays(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania dni:', error);
    }
  };

  const handleDayDrop = (updatedDay) => {
    console.log('Zaktualizowany dzień:', updatedDay);
    
    setDays((prevDays) =>
      prevDays.map((day) => (day.number_of_day === updatedDay.number_of_day ? updatedDay : day))
    );
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Breakfast</th>
            <th>Lunch</th>
            <th>Dinner</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <Day key={day.number_of_day} day={day} userId={userId} onDrop={handleDayDrop} onClick={handleDayDrop} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DaysTable;
