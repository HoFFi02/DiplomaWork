import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Login/LoginForm';
import LanguageSwitcher from '../hooks/LanguageSwitcher.jsx';

function LoginPage() {
  const navigate = useNavigate();

  const handleSuccessfulLogin = () => {
    navigate('/home');
  };

  return (
    <div>
      <LanguageSwitcher />
      <LoginForm onSuccess={handleSuccessfulLogin} />
    </div>
  );
}

export default LoginPage;
