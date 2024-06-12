import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  const navigate = useNavigate();

  const handleSuccessfulLogin = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Login</h2>
      <LoginForm onSuccess={handleSuccessfulLogin} />
    </div>
  );
}

export default LoginPage;
