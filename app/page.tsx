'use client';

import { useEffect, useMemo } from 'react';
import { CityList } from '@/components/CityList';
import { WeatherBackground } from '@/components/WeatherBackground';
import { useCityStore } from '@/store/useCityStore';
import styles from './page.module.scss';

export default function Home() {
  const refreshAllCities = useCityStore((state) => state.refreshAllCities);
  const cities = useCityStore((state) => state.cities);

  const backgroundWeather = useMemo(() => {
    return cities.find((city) => city.weatherData)?.weatherData;
  }, [cities]);

  useEffect(() => {
    if (cities.length > 0) {
      refreshAllCities();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className={styles.main}>
      <WeatherBackground weatherData={backgroundWeather} />
      <div className={styles.container}>
        <h1 className={styles.title}>Weather App</h1>
        <CityList />
      </div>
    </main>
  );
}

