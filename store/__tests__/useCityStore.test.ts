import { renderHook, act, waitFor } from '@testing-library/react';
import { useCityStore } from '../useCityStore';
import { weatherApi } from '@/lib/weather-api';
import { City } from '@/types/weather';

jest.mock('@/lib/weather-api');

const mockWeatherApi = weatherApi as jest.Mocked<typeof weatherApi>;

describe('useCityStore', () => {
  const mockWeatherData = {
    coord: { lon: 30.52, lat: 50.45 },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    base: 'stations',
    main: {
      temp: 20,
      feels_like: 19,
      temp_min: 18,
      temp_max: 22,
      pressure: 1013,
      humidity: 65,
    },
    visibility: 10000,
    wind: { speed: 3.5, deg: 180 },
    clouds: { all: 0 },
    dt: Date.now() / 1000,
    sys: {
      type: 1,
      id: 8903,
      country: 'UA',
      sunrise: Date.now() / 1000,
      sunset: Date.now() / 1000,
    },
    timezone: 7200,
    id: 703448,
    name: 'Kyiv',
    cod: 200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    const store = useCityStore.getState();
    store.cities.forEach((city) => {
      store.removeCity(city.id);
    });
    store.setError(null);
  });

  it('adds a city successfully', async () => {
    mockWeatherApi.getCurrentWeather.mockResolvedValue(mockWeatherData);

    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.addCity('Kyiv');
    });

    await waitFor(() => {
      expect(result.current.cities).toHaveLength(1);
      expect(result.current.cities[0].name).toBe('Kyiv');
      expect(result.current.cities[0].weatherData).toEqual(mockWeatherData);
    });
  });

  it('handles error when adding city fails', async () => {
    const error = new Error('City not found');
    mockWeatherApi.getCurrentWeather.mockRejectedValue(error);

    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      try {
        await result.current.addCity('InvalidCity');
      } catch {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.cities).toHaveLength(0);
    });
  });

  it('removes a city', async () => {
    mockWeatherApi.getCurrentWeather.mockResolvedValue(mockWeatherData);
    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.addCity('Kyiv');
    });

    const cityId = result.current.cities[0].id;

    act(() => {
      result.current.removeCity(cityId);
    });

    expect(result.current.cities).toHaveLength(0);
  });

  it('refreshes city weather', async () => {
    const updatedWeatherData = {
      ...mockWeatherData,
      main: { ...mockWeatherData.main, temp: 25 },
    };

    mockWeatherApi.getCurrentWeather.mockResolvedValue(updatedWeatherData);

    const { result } = renderHook(() => useCityStore());

    // Add a city first
    await act(async () => {
      await result.current.addCity('Kyiv');
    });

    const cityId = result.current.cities[0].id;

    await act(async () => {
      await result.current.refreshCityWeather(cityId);
    });

    await waitFor(() => {
      expect(result.current.cities[0].weatherData?.main.temp).toBe(25);
    });
  });

  it('sets error message', () => {
    const { result } = renderHook(() => useCityStore());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');
  });
});

