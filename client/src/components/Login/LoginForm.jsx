import { useState } from 'react';
import  '../../css/login-register.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_URL from '../../hooks/url';
import { useTranslation } from 'react-i18next';

function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        onSuccess();
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <main className="login-form">
        <h1>{t('welcome')}</h1>
        <p>{t('loginMes')}</p>
        <form onSubmit={handleLogin}>
          <h2>{t('login')}</h2>
          <div className="input-container">
            <ion-icon name="person-outline"></ion-icon>
            <input
              type="text"
              placeholder={t('username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <ion-icon name="lock-closed-outline"></ion-icon> 
            <input
              type="password"
              placeholder={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">{t('signIn')}</button>
        </form>
        <p>{t('noAccount')} <Link to="/register" className="link"><span>{t('signUp')}</span></Link>.</p>
      </main>
    </div>
  );
}

export default LoginForm;
