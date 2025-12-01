import { render, screen } from '@testing-library/react';
import { CityList } from '../CityList';
import { useCityStore } from '@/store/useCityStore';
import { City } from '@/types/weather';

jest.mock('@/store/useCityStore');

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
    mockUseCityStore.mockReturnValue({
      cities: [],
      error: null,
      setError: mockSetError,
    } as any);

    render(<CityList />);

    expect(
      screen.getByText(/No cities added yet/i)
    ).toBeInTheDocument();
  });

  it('renders city cards when cities exist', () => {
    mockUseCityStore.mockReturnValue({
      cities: [mockCity],
      error: null,
      setError: mockSetError,
    } as any);

    render(<CityList />);

    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('displays error message when error exists', () => {
    mockUseCityStore.mockReturnValue({
      cities: [],
      error: 'Failed to fetch weather data',
      setError: mockSetError,
    } as any);

    render(<CityList />);

    expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
  });

  it('calls setError with null when error is closed', () => {
    mockUseCityStore.mockReturnValue({
      cities: [],
      error: 'Some error',
      setError: mockSetError,
    } as any);

    render(<CityList />);

    const closeButton = screen.getByLabelText('Close');
    closeButton.click();

    expect(mockSetError).toHaveBeenCalledWith(null);
  });
});

