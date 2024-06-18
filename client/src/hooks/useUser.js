import { useState, useEffect } from 'react';
import axios from 'axios';

function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/session', {
          withCredentials: true // Konieczne dla przesyłania ciasteczek
        });
        console.log('Response status:', response.status); // Debugowanie
        console.log('Dane użytkownika z sesji:', response.data.user); // Debugowanie
        console.log('Dane użytkownika z sesji:', response.data.user);
        setUser(response.data.user || null);
      } catch (error) {
        console.error('Błąd podczas pobierania użytkownika:', error);
      }
    };

    fetchUser();
  }, []);

  return { user };
}

export default useUser;
