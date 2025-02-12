import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ShoppingListPage from './pages/Shopping_listPage';
import PlanPage from './pages/PlanPage';
import React, { useState } from 'react';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/shopping_list" element={<ShoppingListPage />} />
        <Route path="/plan" element={<PlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;