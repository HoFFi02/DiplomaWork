import { useState } from 'react';
import '../../css/login.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';

function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        username,
        password
      }, {
        withCredentials: true // To ensure cookies are sent with the request
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
    <div className="container">
    <main>
    <h1>Witamy serdecznie!</h1>
    <p>Stwórz swój własny plan żywieniowy!</p>
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      
    </form>
    <p>Nie masz jeszcze konta? <Link to="/register"><span>Zarejestruj się</span></Link>.</p>
    </main>
  </div>
  );
}

export default LoginForm;
