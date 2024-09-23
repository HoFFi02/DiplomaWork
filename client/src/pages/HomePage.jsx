import React from 'react';
import axios from 'axios';
import useUser from '../hooks/useUser';
import Nav from '../components/Nav/Nav';
import HomeForm from '../components/Home/HomeForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function HomePage() {
  const { user } = useUser();

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
    <div>
      <Nav />
      <DndProvider backend={HTML5Backend}>
        <HomeForm user={user} onLogout={handleLogout} />
      </DndProvider>
    </div>
  );
}

export default HomePage;
