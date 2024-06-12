import React from 'react';
import useUser from '../hooks/useUser';
import HomeForm from '../components/HomeForm';

function HomePage() {
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  console.log('Wartość user w HomePage:', user); // Debugowanie

  return (
    <div>
      <HomeForm user={user} onLogout={handleLogout} />
    </div>
  );
}

export default HomePage;
