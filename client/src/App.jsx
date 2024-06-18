import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import React, { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    // Implementacja wylogowywania...
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Przekazujemy user i onLogout jako propsy do komponentu HomePage */}
        <Route path="/home" element={<HomePage user={user} onLogout={handleLogout} />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;