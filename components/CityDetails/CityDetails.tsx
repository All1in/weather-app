'use client';

import { ForecastData } from '@/types/weather';
import { City } from '@/types/weather';
import { WeatherInfo } from './WeatherInfo';
import { HourlyChart } from './HourlyChart';
import styles from './CityDetails.module.scss';

interface CityDetailsProps {
  city: City;
  forecastData?: ForecastData;
  isLoading: boolean;
}

export function CityDetails({
  city,
  forecastData,
  isLoading,
}: CityDetailsProps) {
  const weatherData = city.weatherData;

  if (!weatherData) {
    return (
      <div className={styles.container}>
        <p>Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <WeatherInfo city={city} weatherData={weatherData} />
      {forecastData && (
        <HourlyChart
          forecastData={forecastData}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

