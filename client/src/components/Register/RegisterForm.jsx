import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/login-register.css';
import { Link } from 'react-router-dom';
import API_URL from '../../hooks/url';
import { useTranslation } from 'react-i18next';
const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                username,
                password,
                email
            });
            console.log('Registration successful:', response.data);
            navigate('/');
        } catch (error) {
            setError('Registration error: ' + error.message);
            console.error('Registration error:', error);
        }
    };

    return (
        <div className='register-container'>
            <main className='register-form'>
                <h1>{t('createAccount')}</h1>
                <form onSubmit={handleRegister}>
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
                    <div className="input-container">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input
                            type="email"
                            placeholder={t('email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">{t('signUp')}</button>
                    {error && <p>{error}</p>}
                </form>
                <p>{t('haveAccount')} <Link to="/" className="link"><span>{t('signIn')}</span></Link>.</p>
            </main>
        </div>
    );
};

export default RegisterForm;
