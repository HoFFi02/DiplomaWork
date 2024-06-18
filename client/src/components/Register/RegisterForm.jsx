import React, { useState } from 'react';
import axios from 'axios';
import '../../css/login.css';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/auth/register', {
                username,
                password,
                email
            });
            console.log('Registration successful:', response.data);
            // Dalsze akcje po rejestracji sukcesu
        } catch (error) {
            setError('Registration error: ' + error.message);
            console.error('Registration error:', error);
        }
    };

    return (
        
        <div className='container'>
            <main>
            <h1>Zarejestruj się!</h1>
            <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Register</button>
            {error && <p>{error}</p>}
            </form>
            </main>
        </div>
        
        
    );
};

export default RegisterForm;
