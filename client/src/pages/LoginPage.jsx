import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Login/LoginForm';

function LoginPage() {
  const navigate = useNavigate();

  const handleSuccessfulLogin = () => {
    navigate('/home');
  };

  return (
    <div>
      <LoginForm onSuccess={handleSuccessfulLogin} />
    </div>
  );
}

export default LoginPage;
