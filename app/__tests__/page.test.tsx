import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Home from '../page';
import { useCityStore } from '@/store/useCityStore';
import { City } from '@/types/weather';

jest.mock('next/navigation');
jest.mock('@/store/useCityStore');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseCityStore = useCityStore as jest.MockedFunction<typeof useCityStore>;

describe('Home Page', () => {
  const mockRefreshAllCities = jest.fn();
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
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any);
  });

  it('renders page title correctly', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        refreshAllCities: mockRefreshAllCities,
      };
      return selector(state as any);
    });

    render(<Home />);

    expect(screen.getByText('Weather App')).toBeInTheDocument();
  });

  it('calls refreshAllCities when cities exist on mount', async () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [mockCity],
        refreshAllCities: mockRefreshAllCities,
      };
      return selector(state as any);
    });

    render(<Home />);

    await waitFor(() => {
      expect(mockRefreshAllCities).toHaveBeenCalled();
    });
  });

  it('does not call refreshAllCities when no cities exist', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        refreshAllCities: mockRefreshAllCities,
      };
      return selector(state as any);
    });

    render(<Home />);

    expect(mockRefreshAllCities).not.toHaveBeenCalled();
  });

  it('renders CityList component', () => {
    mockUseCityStore.mockImplementation((selector) => {
      const state = {
        cities: [],
        refreshAllCities: mockRefreshAllCities,
        error: null,
        setError: jest.fn(),
      };
      return selector(state as any);
    });

    render(<Home />);

    expect(
      screen.getByPlaceholderText(/Enter city name/i)
    ).toBeInTheDocument();
  });
});

