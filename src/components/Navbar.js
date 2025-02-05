import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Navbar() {
  const { user } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Курьерская Служба</Link>
      </div>
      <div className="navbar-links">
        <Link to="/orders">Заказы</Link>
        <Link to="/calculator">Калькулятор</Link>
        {user ? (
          <div className="user-menu">
            <span className="welcome-text">Добро пожаловать, {user.name}</span>
            <Link to="/profile">Профиль</Link>
          </div>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 