import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { CityCard } from '../CityCard';
import { useCityStore } from '@/store/useCityStore';
import { City } from '@/types/weather';

jest.mock('next/navigation');
jest.mock('@/store/useCityStore');

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseCityStore = useCityStore as jest.MockedFunction<typeof useCityStore>;

describe('CityCard', () => {
  const mockPush = jest.fn();
  const mockRefreshCityWeather = jest.fn();
  const mockCity: City = {
    id: '1',
    name: 'Kyiv',
    country: 'UA',
    lastUpdated: Date.now(),
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
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    } as any);

    mockUseCityStore.mockReturnValue({
      refreshCityWeather: mockRefreshCityWeather,
      isLoading: false,
    } as any);
  });

  it('renders city information correctly', () => {
    render(<CityCard city={mockCity} />);

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('UA')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Clear sky')).toBeInTheDocument();
  });

  it('navigates to city detail page on card click', () => {
    render(<CityCard city={mockCity} />);

    const card = screen.getByText('Kyiv').closest('div[class*="card"]');
    fireEvent.click(card!);

    expect(mockPush).toHaveBeenCalledWith('/city/1');
  });

  it('calls refreshCityWeather when refresh button is clicked', async () => {
    mockRefreshCityWeather.mockResolvedValue(undefined);

    render(<CityCard city={mockCity} />);

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockRefreshCityWeather).toHaveBeenCalledWith('1');
    });
  });

  it('stops event propagation when refresh button is clicked', async () => {
    mockRefreshCityWeather.mockResolvedValue(undefined);

    render(<CityCard city={mockCity} />);

    const card = screen.getByText('Kyiv').closest('div[class*="card"]');
    const refreshButton = screen.getByText('Refresh');

    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockRefreshCityWeather).toHaveBeenCalled();
    });

    // Ensure navigation didn't happen
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows loading state when weather data is missing', () => {
    const cityWithoutWeather: City = {
      id: '2',
      name: 'London',
      country: 'GB',
    };

    render(<CityCard city={cityWithoutWeather} />);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
  });
});

