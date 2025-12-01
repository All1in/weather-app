import axios, { AxiosError } from 'axios';
import { WeatherData, ForecastData } from '@/types/weather';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

if (!API_KEY) {
  console.warn('NEXT_PUBLIC_WEATHER_API_KEY is not set');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; cod?: string }>;
    
    if (axiosError.response) {
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      if (status === 401) {
        throw new Error(
          'Invalid API key. Please check your OpenWeatherMap API key in .env.local file.'
        );
      }
      if (status === 404) {
        throw new Error(
          data?.message || 'City not found. Please check the city name.'
        );
      }
      if (status === 429) {
        throw new Error(
          'API rate limit exceeded. Please wait a moment and try again.'
        );
      }
      if (status >= 500) {
        throw new Error('Weather service is temporarily unavailable. Please try again later.');
      }

      throw new Error(
        data?.message || `API error: ${status} ${axiosError.response.statusText}`
      );
    }

    if (axiosError.request) {
      throw new Error(
        'Unable to connect to weather service. Please check your internet connection.'
      );
    }
  }

  throw new Error(
    error instanceof Error
      ? error.message
      : 'An unexpected error occurred while fetching weather data.'
  );
};

export const weatherApi = {
  getCurrentWeather: async (cityName: string): Promise<WeatherData> => {
    try {
      const response = await apiClient.get<WeatherData>('/weather', {
        params: {
          q: cityName,
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getHourlyForecast: async (
    cityName: string
  ): Promise<ForecastData> => {
    try {
      const response = await apiClient.get<ForecastData>('/forecast', {
        params: {
          q: cityName,
          cnt: 24,
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

