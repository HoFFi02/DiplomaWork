import { useState, useEffect } from 'react';
import axios from 'axios';

function useUser() {
  const [user, setUser] = useState(null);
  const API_URL = window.location.hostname === 'localhost' 
  ? import.meta.env.VITE_API_URL_LOCAL 
  : import.meta.env.VITE_API_URL_IP;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/session`, {
          withCredentials: true 
        });
        if (response.status === 200) {
          setUser(response.data.user || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania użytkownika:', error);
      }
    };

    fetchUser();
  }, []);

  return { user };
}

export default useUser;
