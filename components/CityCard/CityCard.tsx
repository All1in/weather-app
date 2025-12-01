'use client';

import { useRouter } from 'next/navigation';
import { City } from '@/types/weather';
import { useCityStore } from '@/store/useCityStore';
import { RefreshButton } from './RefreshButton';
import { DeleteButton } from './DeleteButton';
import styles from './CityCard.module.scss';

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  const router = useRouter();
  const refreshCityWeather = useCityStore((state) => state.refreshCityWeather);
  const isLoading = useCityStore((state) => state.isLoading);

  const handleCardClick = () => {
    router.push(`/city/${city.id}`);
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await refreshCityWeather(city.id);
  };

  const weatherData = city.weatherData;

  if (!weatherData) {
    return (
      <div className={styles.card}>
        <div className={styles.content}>
          <h3>{city.name}</h3>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  const weather = weatherData.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <div className={styles.location}>
          <h3 className={styles.cityName}>{city.name}</h3>
          <span className={styles.country}>{city.country}</span>
        </div>
        <DeleteButton cityId={city.id} />
      </div>

      <div className={styles.content}>
        <div className={styles.weatherMain}>
          <img src={iconUrl} alt={weather.description} className={styles.icon} />
          <div className={styles.temperature}>
            <span className={styles.tempValue}>
              {Math.round(weatherData.main.temp)}
            </span>
            <span className={styles.tempUnit}>°C</span>
          </div>
        </div>

        <div className={styles.weatherInfo}>
          <p className={styles.description}>
            {weather.description.charAt(0).toUpperCase() +
              weather.description.slice(1)}
          </p>
          <div className={styles.details}>
            <span>Feels like: {Math.round(weatherData.main.feels_like)}°C</span>
            <span>Humidity: {weatherData.main.humidity}%</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <RefreshButton
          onRefresh={handleRefresh}
          isLoading={isLoading}
          lastUpdated={city.lastUpdated}
        />
      </div>
    </div>
  );
}

