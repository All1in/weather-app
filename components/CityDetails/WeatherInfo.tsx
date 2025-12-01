'use client';

import { City, WeatherData } from '@/types/weather';
import styles from './CityDetails.module.scss';

interface WeatherInfoProps {
  city: City;
  weatherData: WeatherData;
}

export function WeatherInfo({ city, weatherData }: WeatherInfoProps) {
  const weather = weatherData.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.weatherInfo}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.cityName}>
            {city.name}, {city.country}
          </h2>
          <p className={styles.description}>
            {weather.description.charAt(0).toUpperCase() +
              weather.description.slice(1)}
          </p>
        </div>
        <img src={iconUrl} alt={weather.description} className={styles.icon} />
      </div>

      <div className={styles.temperature}>
        <span className={styles.tempValue}>
          {Math.round(weatherData.main.temp)}
        </span>
        <span className={styles.tempUnit}>°C</span>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.label}>Feels like</span>
          <span className={styles.value}>
            {Math.round(weatherData.main.feels_like)}°C
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Min / Max</span>
          <span className={styles.value}>
            {Math.round(weatherData.main.temp_min)}°C /{' '}
            {Math.round(weatherData.main.temp_max)}°C
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Humidity</span>
          <span className={styles.value}>{weatherData.main.humidity}%</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Pressure</span>
          <span className={styles.value}>{weatherData.main.pressure} hPa</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Wind Speed</span>
          <span className={styles.value}>
            {weatherData.wind.speed} m/s
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Visibility</span>
          <span className={styles.value}>
            {(weatherData.visibility / 1000).toFixed(1)} km
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Sunrise</span>
          <span className={styles.value}>
            {formatTime(weatherData.sys.sunrise)}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>Sunset</span>
          <span className={styles.value}>
            {formatTime(weatherData.sys.sunset)}
          </span>
        </div>
      </div>
    </div>
  );
}

