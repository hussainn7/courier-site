import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }

      // Check if user already exists
      const existingUserData = localStorage.getItem('userData');
      if (existingUserData) {
        const existingUser = JSON.parse(existingUserData);
        if (existingUser.email === formData.email) {
          alert('Пользователь с таким email уже существует');
          return;
        }
      }

      // Create user data
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // In a real app, this should be hashed
        registrationDate: new Date().toISOString(),
        ordersCount: 0,
        isLoggedIn: true
      };

      // Save to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Update global user state
      setUser(userData);
      
      console.log('Registration successful');
      navigate('/profile');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Произошла ошибка при регистрации. Попробуйте еще раз.');
    }
  };

  return (
    <div className="register">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={50}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          />
        </div>
        <div>
          <label>Телефон:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9+\s-()]+"
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div>
          <label>Подтвердите пароль:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Register; 