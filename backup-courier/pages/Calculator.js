import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Set default icon for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Calculator() {
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [price, setPrice] = useState(0);
  const [distance, setDistance] = useState(0);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  useEffect(() => {
    const mapInstance = L.map('map').setView([55.751244, 37.618423], 11); // Center on Moscow

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);

    // Define the click handler functions first
    window.setAsOrigin = (lat, lng) => {
      const coords = { lat, lng };
      setOrigin(coords);
      setAddress1(`Latitude: ${lat}, Longitude: ${lng}`);
      mapInstance.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.getPopup().getContent() === 'Origin') {
          mapInstance.removeLayer(layer);
        }
      });
      L.marker(coords).addTo(mapInstance).bindPopup('Origin').openPopup();
      calculateDistance();
    };

    window.setAsDestination = (lat, lng) => {
      const coords = { lat, lng };
      setDestination(coords);
      setAddress2(`Latitude: ${lat}, Longitude: ${lng}`);
      mapInstance.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.getPopup().getContent() === 'Destination') {
          mapInstance.removeLayer(layer);
        }
      });
      L.marker(coords).addTo(mapInstance).bindPopup('Destination').openPopup();
      calculateDistance();
    };

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      const popupContent = `
        <div>
          <p>Выбрать эту точку как:</p>
          <button onclick="window.setAsOrigin(${lat}, ${lng})">Точка отправления</button>
          <button onclick="window.setAsDestination(${lat}, ${lng})">Точка назначения</button>
        </div>
      `;
      
      L.popup()
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(mapInstance);
    };

    mapInstance.on('click', handleMapClick);
    setMap(mapInstance);

    return () => {
      mapInstance.off('click', handleMapClick);
      mapInstance.remove();
    };
  }, []);

  const calculateDistance = () => {
    if (origin && destination) {
      const lat1 = origin.lat;
      const lon1 = origin.lng;
      const lat2 = destination.lat;
      const lon2 = destination.lng;

      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceInKm = R * c;

      setDistance(distanceInKm);
      const basePrice = 300; // Base rate
      const pricePerKm = 300; // Price per kilometer
      const calculatedPrice = basePrice + (distanceInKm * pricePerKm);
      setPrice(Math.round(calculatedPrice));
    }
  };

  const resetPoints = () => {
    setOrigin(null);
    setDestination(null);
    setAddress1('');
    setAddress2('');
    setPrice(0);
    setDistance(0);
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
  };

  return (
    <div className="calculator-container">
      <h2>Калькулятор стоимости доставки</h2>
      <div className="calculator-content">
        <div id="map" style={{ height: '400px', width: '100%' }}></div>
        <div className="calculator-form">
          <div className="address-inputs">
            <div className="input-group">
              <label>Точка отправления:</label>
              <input
                type="text"
                value={address1}
                readOnly
                placeholder="Кликните по карте для выбора"
              />
            </div>
            <div className="input-group">
              <label>Точка назначения:</label>
              <input
                type="text"
                value={address2}
                readOnly
                placeholder="Кликните по карте для выбора"
              />
            </div>
          </div>

          <div className="calculator-buttons">
            <button 
              className="calculate-button"
              onClick={calculateDistance}
              disabled={!origin || !destination}
            >
              Рассчитать стоимость
            </button>
            <button 
              className="reset-button"
              onClick={resetPoints}
            >
              Сбросить точки
            </button>
          </div>

          {price > 0 && (
            <div className="price-display">
              <h3>Расчет стоимости:</h3>
              <p>Расстояние: {distance.toFixed(1)} км</p>
              <p>Стоимость доставки: {price} ₽</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator; 