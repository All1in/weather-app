'use client';

import { useState } from 'react';
import { Add } from '@mui/icons-material';
import { useCityStore } from '@/store/useCityStore';
import styles from './AddCityForm.module.scss';

export function AddCityForm() {
  const [cityName, setCityName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addCity = useCityStore((state) => state.addCity);
  const cities = useCityStore((state) => state.cities);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cityName.trim()) return;

    const normalizedName = cityName.trim();
    
    if (cities.some(city => city.name.toLowerCase() === normalizedName.toLowerCase())) {
      alert('This city is already in your list!');
      return;
    }

    setIsSubmitting(true);
    try {
      await addCity(normalizedName);
      setCityName('');
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Enter city name (e.g., Kyiv, London, New York)"
          className={styles.input}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={isSubmitting || !cityName.trim()}
        >
          <Add />
          <span>Add City</span>
        </button>
      </div>
    </form>
  );
}

