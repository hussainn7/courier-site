import React, { useState, useEffect } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Здесь будет загрузка заказов из базы данных
  }, []);

  return (
    <div className="orders">
      <h2>Мои заказы</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <h3>Заказ #{order.id}</h3>
            <p>От: {order.origin}</p>
            <p>До: {order.destination}</p>
            <p>Статус: {order.status}</p>
            <p>Стоимость: {order.price} ₽</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders; 