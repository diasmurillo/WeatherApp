import React, { useState, useEffect } from 'react';
import styles from './Weather.module.css';

function Weather() {
  const [city, setCity] = useState('Lisboa');
  const [cityInput, setCityInput] = useState('Lisboa');
  const [weatherData, setWeatherData] = useState();
  const [erro, setErro] = useState(null);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;


  async function fetchWeather() {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setWeatherData(data);
      setErro(null);
    } catch (error) {
      setErro(error.message);
      setWeatherData(null);
    }
  }

  useEffect(() => {
    fetchWeather();
  }, [city]);

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          className={styles.input}
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button className={styles.button} onClick={() => setCity(cityInput)}>Buscar</button>
      </div>

      {erro && <p style={{ color: 'red' }}> {erro}</p>}

      {!weatherData && !erro && (
        <p className={styles.loadingText}>...Carregando</p>
      )}

      {weatherData && (
        <div className={styles.weatherInfo}>
          <h1>Clima em {weatherData.name}, {weatherData.sys.country}</h1>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <p>{weatherData.weather[0].description}</p>
          <p>Temperatura: {weatherData.main.temp}°C</p>
          <p>Sensação térmica: {weatherData.main.feels_like}°C</p>
          <p>🌅 Nascer do sol: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('pt-PT')}</p>
          <p>🌇 Pôr do sol: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('pt-PT')}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
