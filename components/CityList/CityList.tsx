'use client';

import { useCityStore } from '@/store/useCityStore';
import { CityCard } from '../CityCard';
import { AddCityForm } from '../AddCityForm';
import { ErrorMessage } from '../ErrorMessage';
import styles from './CityList.module.scss';

export function CityList() {
  const cities = useCityStore((state) => state.cities);
  const error = useCityStore((state) => state.error);
  const setError = useCityStore((state) => state.setError);

  return (
    <div className={styles.container}>
      <AddCityForm />
      
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {cities.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No cities added yet. Add a city to see the weather!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      )}
    </div>
  );
}

