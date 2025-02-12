import React from 'react';
import RegisterForm from '../components/Register/RegisterForm';
import LanguageSwitcher from '../hooks/LanguageSwitcher.jsx';

const RegisterPage = () => {
    return (
        <div>
            <LanguageSwitcher />
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
