import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/home.css';
import DaysTable from './Day/DaysTable';
import RecipesTable from './Recipe/RecipesTable';

function HomeForm({ user, onLogout }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
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

    fetchDays();
  }, []);

  if (!user) {
    return <div>Brak danych użytkownika</div>;
  }
  
  return (
    <div className="container">
      <div className="days-table">
        <h2>Plan Dni</h2>
        <DaysTable days={days} userId={user.id_user} />
      </div>
      <div className="recipes-table">
        <h2>Przepisy</h2>
        <RecipesTable />
      </div>
    </div>
  );
}

export default HomeForm;
