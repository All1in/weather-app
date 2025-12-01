'use client';

import { useEffect } from 'react';
import { CityList } from '@/components/CityList';
import { useCityStore } from '@/store/useCityStore';
import styles from './page.module.scss';

export default function Home() {
  const refreshAllCities = useCityStore((state) => state.refreshAllCities);
  const cities = useCityStore((state) => state.cities);

  useEffect(() => {
    // Refresh all cities weather data on mount
    if (cities.length > 0) {
      refreshAllCities();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Weather App</h1>
        <CityList />
      </div>
    </main>
  );
}

