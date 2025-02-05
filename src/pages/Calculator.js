import React, { useEffect } from 'react';
import './Calculator.css';

function Calculator() {
  const ratePerKm = 450; // Стоимость за км

  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="api-maps.yandex.ru"]')) {
      window.ymaps.ready(init);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=2e1510a2-a865-4d6e-aae3-839289d6bf95&lang=ru_RU';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.ymaps.ready(init);
    };

    return () => {
      // Only remove script if it exists and we added it
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Clean up map instance if it exists
      if (window.mapInstance && typeof window.mapInstance.destroy === 'function') {
        window.mapInstance.destroy();
        window.mapInstance = null;
      }
    };
  }, []);

  function init() {
    // If map already exists, destroy it
    if (window.mapInstance && typeof window.mapInstance.destroy === 'function') {
      window.mapInstance.destroy();
    }

    let points = [];
    let placemarks = [];
    let distance = 0;

    const myMap = new window.ymaps.Map('map', {
      center: [55.76, 37.64],
      zoom: 10
    });

    // Store map instance globally for cleanup
    window.mapInstance = myMap;

    myMap.events.add('click', function (e) {
      const coords = e.get('coords');
      if (placemarks.length >= 2) {
        placemarks.forEach(placemark => myMap.geoObjects.remove(placemark));
        points = [];
        placemarks = [];
      }
      addPlacemark(coords);
    });

    function addPlacemark(coords) {
      const placemark = new window.ymaps.Placemark(coords, {}, {
        preset: 'islands#blueIcon',
        draggable: true
      });

      placemark.events.add('click', function () {
        myMap.geoObjects.remove(this);
        points.splice(placemarks.indexOf(this), 1);
        placemarks.splice(placemarks.indexOf(this), 1);
        updateResults();
      });

      placemark.events.add('dragend', function () {
        points[placemarks.indexOf(this)] = this.geometry.getCoordinates();
        updateResults();
      });

      myMap.geoObjects.add(placemark);
      points.push(coords);
      placemarks.push(placemark);

      // Get and show address immediately when point is added
      window.ymaps.geocode(coords).then(function (res) {
        const addressElement = document.getElementById(`address${points.length}`);
        if (addressElement) {
          addressElement.textContent = res.geoObjects.get(0).getAddressLine();
        }
      });

      updateResults();
    }

    function updateResults() {
      const distanceElement = document.getElementById('distance');
      const costElement = document.getElementById('cost');
      const address1Element = document.getElementById('address1');
      const address2Element = document.getElementById('address2');

      if (points.length === 2) {
        distance = window.ymaps.coordSystem.geo.getDistance(points[0], points[1]);
        const distanceInKm = distance / 1000;
        distanceElement.textContent = `${Math.round(distance)} м (${distanceInKm.toFixed(2)} км)`;
        costElement.textContent = (distanceInKm * ratePerKm).toFixed(2)+ "₽";

        points.forEach((point, index) => {
          window.ymaps.geocode(point).then(function (res) {
            const addressElement = document.getElementById(`address${index + 1}`);
            if (addressElement) {
              addressElement.textContent = res.geoObjects.get(0).getAddressLine();
            }
          });
        });
      } else {
        distanceElement.textContent = '0 м (0 км)';
        costElement.textContent = '0₽';
        address1Element.textContent = '';
        address2Element.textContent = '';
        distance = 0;
      }
    }
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Калькулятор стоимости доставки</h2>
      </div>
      
      <div className="calculator-content">
        <div className="map-container">
          <div id="map"></div>
          <div className="map-legend">
            <div className="legend-item">
              <span className="legend-dot start"></span>
              <span className="legend-text">Точка отправления</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot end"></span>
              <span className="legend-text">Точка назначения</span>
            </div>
          </div>
        </div>

        <div className="results-container">
          <div className="results-card">
            <div className="result-item">
              <h3>Расстояние</h3>
              <span id="distance" className="value">0 м (0 км)</span>
            </div>
            <div className="result-item">
              <h3>Стоимость доставки</h3>
              <span id="cost" className="value">0 ₽</span>
            </div>
            <div className="result-item">
              <h3>Точка отправления</h3>
              <span id="address1" className="address"></span>
            </div>
            <div className="result-item">
              <h3>Точка назначения</h3>
              <span id="address2" className="address"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator; 