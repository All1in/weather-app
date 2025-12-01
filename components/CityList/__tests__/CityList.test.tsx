import { render, screen } from '@testing-library/react';
import { CityList } from '../CityList';
import { useCityStore } from '@/store/useCityStore';
import { City } from '@/types/weather';

jest.mock('@/store/useCityStore');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const mockUseCityStore = useCityStore as jest.MockedFunction<typeof useCityStore>;

describe('CityList', () => {
  const mockSetError = jest.fn();
  const mockCity: City = {
    id: '1',
    name: 'Kyiv',
    country: 'UA',
    weatherData: {
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
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no cities', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        error: null,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    expect(
      screen.getByText(/No cities added yet/i)
    ).toBeInTheDocument();
  });

  it('renders city cards when cities exist', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [mockCity],
        error: null,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('displays error message when error exists', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        error: 'Failed to fetch weather data',
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
  });

  it('calls setError with null when error is closed', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        error: 'Some error',
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    const closeButton = screen.getByLabelText('Close');
    closeButton.click();

    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('renders multiple city cards correctly', () => {
    const mockCities: City[] = [
      mockCity,
      {
        ...mockCity,
        id: '2',
        name: 'London',
        country: 'GB',
        weatherData: {
          ...mockCity.weatherData!,
          name: 'London',
          main: { ...mockCity.weatherData!.main, temp: 15 },
        },
      },
      {
        ...mockCity,
        id: '3',
        name: 'Paris',
        country: 'FR',
        weatherData: {
          ...mockCity.weatherData!,
          name: 'Paris',
          main: { ...mockCity.weatherData!.main, temp: 18 },
        },
      },
    ];

    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: mockCities,
        error: null,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('handles empty error state', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [mockCity],
        error: null,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('handles very long error messages', () => {
    const longError = 'A'.repeat(200);
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        error: longError,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    expect(screen.getByText(longError)).toBeInTheDocument();
  });

  it('renders AddCityForm component', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        error: null,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    render(<CityList />);

    expect(
      screen.getByPlaceholderText(/Enter city name/i)
    ).toBeInTheDocument();
  });

  it('handles rapid state changes', () => {
    // Start with empty
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        error: null,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    const { rerender } = render(<CityList />);
    expect(screen.getByText(/No cities added yet/i)).toBeInTheDocument();

    // Add cities
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [mockCity],
        error: null,
        setError: mockSetError,
      };
      return selector(state as any);
    });

    rerender(<CityList />);
    expect(screen.getByText('Kyiv')).toBeInTheDocument();

    // Add error
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [mockCity],
        error: 'Test error',
        setError: mockSetError,
      };
      return selector(state as any);
    });

    rerender(<CityList />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});

