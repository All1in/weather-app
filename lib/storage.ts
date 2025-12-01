import { City } from '@/types/weather';

const STORAGE_KEY = 'weather-app-cities';

export const storage = {
  getCities: (): City[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveCities: (cities: City[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
};

