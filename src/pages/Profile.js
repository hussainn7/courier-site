import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setEditForm({
        name: JSON.parse(storedData).name,
        phone: JSON.parse(storedData).phone
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedUserData = {
      ...userData,
      name: editForm.name,
      phone: editForm.phone
    };
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    try {
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        userData.isLoggedIn = false;
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
      // Clear user context
      setUser(null);
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Произошла ошибка при выходе. Попробуйте еще раз.');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="profile-content">
        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Имя:</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Телефон:</label>
                <input
                  type="tel"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="edit-buttons">
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={() => setIsEditing(false)} className="cancel-button">
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Имя:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Телефон:</strong> {userData.phone}</p>
              <p><strong>Дата регистрации:</strong> {new Date(userData.registrationDate).toLocaleDateString()}</p>
              <p><strong>Количество заказов:</strong> {userData.ordersCount}</p>
              <div className="profile-actions">
                <button onClick={handleEdit}>Редактировать профиль</button>
                <button onClick={handleLogout} className="logout-button">
                  Выйти из аккаунта
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 