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

  it('handles refreshAllCities with empty cities array', async () => {
    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.refreshAllCities();
    });

    expect(mockWeatherApi.getCurrentWeather).not.toHaveBeenCalled();
    expect(result.current.cities).toHaveLength(0);
  });

  it('handles refreshAllCities with multiple cities', async () => {
    const londonData = {
      ...mockWeatherData,
      id: 2643743,
      name: 'London',
      sys: { ...mockWeatherData.sys, country: 'GB' },
    };

    mockWeatherApi.getCurrentWeather
      .mockResolvedValueOnce(mockWeatherData)
      .mockResolvedValueOnce(londonData);

    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.addCity('Kyiv');
      await result.current.addCity('London');
    });

    expect(result.current.cities).toHaveLength(2);

    await act(async () => {
      await result.current.refreshAllCities();
    });

    await waitFor(() => {
      expect(result.current.cities).toHaveLength(2);
      expect(mockWeatherApi.getCurrentWeather).toHaveBeenCalledTimes(4); // 2 adds + 2 refreshes
    });
  });

  it('handles partial refresh failures gracefully', async () => {
    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.addCity('Kyiv');
      await result.current.addCity('London');
    });

    // Mock one success, one failure
    mockWeatherApi.getCurrentWeather
      .mockResolvedValueOnce(mockWeatherData)
      .mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      await result.current.refreshAllCities();
    });

    await waitFor(() => {
      // Should still have both cities, even if one refresh failed
      expect(result.current.cities).toHaveLength(2);
    });
  });

  it('handles refreshCityWeather for non-existent city', async () => {
    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.refreshCityWeather('non-existent-id');
    });

    expect(mockWeatherApi.getCurrentWeather).not.toHaveBeenCalled();
  });

  it('handles concurrent city additions', async () => {
    mockWeatherApi.getCurrentWeather
      .mockResolvedValueOnce(mockWeatherData)
      .mockResolvedValueOnce({
        ...mockWeatherData,
        id: 2643743,
        name: 'London',
      });

    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await Promise.all([
        result.current.addCity('Kyiv'),
        result.current.addCity('London'),
      ]);
    });

    await waitFor(() => {
      expect(result.current.cities).toHaveLength(2);
    });
  });

  it('handles network timeout errors', async () => {
    const timeoutError = new Error('Request timeout');
    mockWeatherApi.getCurrentWeather.mockRejectedValue(timeoutError);

    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      try {
        await result.current.addCity('Kyiv');
      } catch {
        // Expected
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('clears error when adding new city after error', async () => {
    const error = new Error('City not found');
    mockWeatherApi.getCurrentWeather
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(mockWeatherData);

    const { result } = renderHook(() => useCityStore());

    // First attempt fails
    await act(async () => {
      try {
        await result.current.addCity('InvalidCity');
      } catch {
        // Expected
      }
    });

    expect(result.current.error).toBeTruthy();

    // Second attempt succeeds
    await act(async () => {
      await result.current.addCity('Kyiv');
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.cities).toHaveLength(1);
    });
  });

  it('maintains city order after refresh', async () => {
    const londonData = {
      ...mockWeatherData,
      id: 2643743,
      name: 'London',
    };

    mockWeatherApi.getCurrentWeather
      .mockResolvedValueOnce(mockWeatherData)
      .mockResolvedValueOnce(londonData)
      .mockResolvedValueOnce(mockWeatherData)
      .mockResolvedValueOnce(londonData);

    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.addCity('Kyiv');
      await result.current.addCity('London');
    });

    const initialOrder = result.current.cities.map((c) => c.name);

    await act(async () => {
      await result.current.refreshAllCities();
    });

    await waitFor(() => {
      const newOrder = result.current.cities.map((c) => c.name);
      expect(newOrder).toEqual(initialOrder);
    });
  });

  it('handles removing city that is being refreshed', async () => {
    mockWeatherApi.getCurrentWeather.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockWeatherData), 100);
        })
    );

    const { result } = renderHook(() => useCityStore());

    await act(async () => {
      await result.current.addCity('Kyiv');
    });

    const cityId = result.current.cities[0].id;

    // Start refresh
    const refreshPromise = act(async () => {
      await result.current.refreshCityWeather(cityId);
    });

    // Remove city while refreshing
    act(() => {
      result.current.removeCity(cityId);
    });

    await refreshPromise;

    expect(result.current.cities).toHaveLength(0);
  });

  it('handles isLoading state correctly during operations', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockWeatherApi.getCurrentWeather.mockImplementation(() => promise as any);

    const { result } = renderHook(() => useCityStore());

    expect(result.current.isLoading).toBe(false);

    // Start async operation
    act(() => {
      result.current.addCity('Kyiv');
    });

    // Check isLoading is true during operation
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Resolve the promise
    act(() => {
      resolvePromise!(mockWeatherData);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});

