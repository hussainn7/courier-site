import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Clock, Shield, MapPin, Calculator } from 'lucide-react';

function Home() {
  const [animatedStats, setAnimatedStats] = useState(stats.map(stat => ({
    ...stat,
    current: 0,
    isAnimating: false
  })));

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCountAnimation();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) observer.observe(statsSection);

    return () => observer.disconnect();
  }, []);

  const startCountAnimation = () => {
    animatedStats.forEach((stat, index) => {
      if (stat.isAnimating) return;
      
      const finalValue = parseInt(stat.value.replace(/[^0-9]/g, ''));
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = finalValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
          current = finalValue;
          clearInterval(timer);
        }
        
        setAnimatedStats(prev => prev.map((s, i) => 
          i === index ? {
            ...s,
            current: Math.floor(current),
            isAnimating: true
          } : s
        ));
      }, duration / steps);
    });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{ 
          backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1682129768936-c5b7c3033cdc?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
        }}
      >
        <div className="hero-content">
          <h1>Экспресс-доставка по всей России</h1>
          <p>Быстрая и надежная курьерская служба для бизнеса и частных лиц. Доставляем ваши посылки в любую точку страны.</p>
          <div className="hero-buttons">
            <Link to="/calculator" className="primary-button">
              Рассчитать стоимость
            </Link>
            <Link to="/register" className="secondary-button">
              Оформить заказ
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="animate-fade-in">Наши услуги</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {service.icon}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="animate-fade-in">Почему выбирают нас</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-item animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {animatedStats.map((stat, index) => (
            <div
              key={index}
              className="stat-item animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <h3>
                {stat.value.includes('+') 
                  ? `${stat.current.toLocaleString()}+`
                  : stat.value.includes('%')
                  ? `${stat.current}%`
                  : stat.value.includes('/')
                  ? '24/7'
                  : stat.current.toLocaleString()}
              </h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="cta-section animate-fade-in"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")'
        }}
      >
        <div className="cta-overlay">
          <div className="cta-content">
            <h2>Начните работать с нами уже сегодня</h2>
            <p>Зарегистрируйтесь и получите скидку 10% на первый заказ</p>
            <Link to="/register" className="cta-button">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>О компании</h3>
            <ul>
              <li><Link to="/about">О нас</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
              <li><Link to="/careers">Вакансии</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Услуги</h3>
            <ul>
              <li><Link to="/services/courier">Курьерская доставка</Link></li>
              <li><Link to="/services/cargo">Грузоперевозки</Link></li>
              <li><Link to="/services/express">Экспресс-доставка</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Клиентам</h3>
            <ul>
              <li><Link to="/calculator">Калькулятор</Link></li>
              <li><Link to="/tracking">Отследить заказ</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Контакты</h3>
            <p>Телефон: 8 (800) 123-45-67</p>
            <p>Email: info@courier.ru</p>
            <p>Адрес: г. Москва, ул. Примерная, 123</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Курьерская Служба. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}

const services = [
  {
    icon: <Package className="service-icon" />,
    title: "Курьерская доставка",
    description: "Доставка документов и посылок по городу в течение дня"
  },
  {
    icon: <Truck className="service-icon" />,
    title: "Грузоперевозки",
    description: "Перевозка крупногабаритных грузов по всей России"
  },
  {
    icon: <Clock className="service-icon" />,
    title: "Экспресс-доставка",
    description: "Срочная доставка в течение нескольких часов"
  }
];

const features = [
  {
    icon: <Shield className="feature-icon" />,
    title: "Надежность",
    description: "Гарантируем сохранность ваших отправлений"
  },
  {
    icon: <Clock className="feature-icon" />,
    title: "Пунктуальность",
    description: "Доставляем точно в срок"
  },
  {
    icon: <MapPin className="feature-icon" />,
    title: "Широкий охват",
    description: "Работаем по всей России"
  },
  {
    icon: <Calculator className="feature-icon" />,
    title: "Прозрачные цены",
    description: "Честные тарифы без скрытых платежей"
  }
];

const stats = [
  { value: "50000+", label: "Доставок ежемесячно" },
  { value: "100%", label: "Довольных клиентов" },
  { value: "150+", label: "Городов доставки" },
  { value: "24/7", label: "Поддержка клиентов" }
];

export default Home; 