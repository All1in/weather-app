import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { City, WeatherData } from '@/types/weather';
import { weatherApi } from '@/lib/weather-api';

interface CityStore {
  cities: City[];
  isLoading: boolean;
  error: string | null;
  addCity: (cityName: string) => Promise<void>;
  removeCity: (cityId: string) => void;
  refreshCityWeather: (cityId: string) => Promise<void>;
  refreshAllCities: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useCityStore = create<CityStore>()(
  persist(
    (set, get) => ({
      cities: [],
      isLoading: false,
      error: null,

      addCity: async (cityName: string) => {
        set({ isLoading: true, error: null });
        try {
          const weatherData = await weatherApi.getCurrentWeather(cityName);
          
          const newCity: City = {
            id: `${weatherData.id}-${Date.now()}`,
            name: weatherData.name,
            country: weatherData.sys.country,
            weatherData,
            lastUpdated: Date.now(),
          };

          set((state) => ({
            cities: [...state.cities, newCity],
            isLoading: false,
          }));
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to add city. Please check the city name.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      removeCity: (cityId: string) => {
        set((state) => ({
          cities: state.cities.filter((city) => city.id !== cityId),
        }));
      },

      refreshCityWeather: async (cityId: string) => {
        const city = get().cities.find((c) => c.id === cityId);
        if (!city) return;

        set({ isLoading: true, error: null });
        try {
          const weatherData = await weatherApi.getCurrentWeather(city.name);

          set((state) => ({
            cities: state.cities.map((c) =>
              c.id === cityId
                ? {
                    ...c,
                    weatherData,
                    lastUpdated: Date.now(),
                  }
                : c
            ),
            isLoading: false,
          }));
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to refresh weather data.';
          set({ error: errorMessage, isLoading: false });
        }
      },

      refreshAllCities: async () => {
        const { cities } = get();
        if (cities.length === 0) return;

        set({ isLoading: true, error: null });
        try {
          const refreshPromises = cities.map(async (city) => {
            try {
              const weatherData = await weatherApi.getCurrentWeather(
                city.name
              );
              return {
                ...city,
                weatherData,
                lastUpdated: Date.now(),
              };
            } catch {
              return city;
            }
          });

          const updatedCities = await Promise.all(refreshPromises);
          set({ cities: updatedCities, isLoading: false });
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to refresh weather data.';
          set({ error: errorMessage, isLoading: false });
        }
      },

      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'weather-app-storage',
      partialize: (state) => ({ cities: state.cities }),
    }
  )
);

