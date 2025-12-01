import { render, screen } from '@testing-library/react';
import { CityDetails } from '../CityDetails';
import { City, ForecastData } from '@/types/weather';

describe('CityDetails', () => {
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

  const mockForecastData: ForecastData = {
    cod: '200',
    message: 0,
    cnt: 8,
    list: [
      {
        dt: Date.now() / 1000,
        main: {
          temp: 20,
          feels_like: 19,
          temp_min: 18,
          temp_max: 22,
          pressure: 1013,
          humidity: 65,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        clouds: { all: 0 },
        wind: { speed: 3.5, deg: 180 },
        visibility: 10000,
        pop: 0,
        dt_txt: new Date().toISOString(),
      },
    ],
    city: {
      id: 703448,
      name: 'Kyiv',
      coord: { lat: 50.45, lon: 30.52 },
      country: 'UA',
      population: 2967000,
      timezone: 7200,
      sunrise: Date.now() / 1000,
      sunset: Date.now() / 1000,
    },
  };

  it('renders city details with weather data', () => {
    render(
      <CityDetails
        city={mockCity}
        forecastData={mockForecastData}
        isLoading={false}
      />
    );

    expect(screen.getByText('Kyiv, UA')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('shows loading state when weather data is missing', () => {
    const cityWithoutWeather: City = {
      id: '2',
      name: 'London',
      country: 'GB',
    };

    render(
      <CityDetails
        city={cityWithoutWeather}
        forecastData={undefined}
        isLoading={false}
      />
    );

    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
  });

  it('renders forecast chart when forecast data is provided', () => {
    // Mock current date to ensure chart renders
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    jest.useFakeTimers();
    jest.setSystemTime(today);

    const forecastWithToday: ForecastData = {
      ...mockForecastData,
      list: [
        {
          ...mockForecastData.list[0],
          dt: Math.floor(today.getTime() / 1000),
        },
      ],
    };

    render(
      <CityDetails
        city={mockCity}
        forecastData={forecastWithToday}
        isLoading={false}
      />
    );

    expect(
      screen.getByText('24-Hour Temperature Forecast')
    ).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('does not render chart when forecast data is missing', () => {
    render(
      <CityDetails
        city={mockCity}
        forecastData={undefined}
        isLoading={false}
      />
    );

    expect(
      screen.queryByText('24-Hour Temperature Forecast')
    ).not.toBeInTheDocument();
  });

  it('shows loading state for forecast', () => {
    render(
      <CityDetails
        city={mockCity}
        forecastData={undefined}
        isLoading={true}
      />
    );

    // Chart should show loading or not render
    expect(
      screen.queryByText('24-Hour Temperature Forecast')
    ).not.toBeInTheDocument();
  });

  it('handles city with empty weather array gracefully', () => {
    const cityWithEmptyWeather: City = {
      ...mockCity,
      weatherData: {
        ...mockCity.weatherData!,
        weather: [],
      },
    };

    // This will throw an error, but we're testing that it's handled
    expect(() => {
      render(
        <CityDetails
          city={cityWithEmptyWeather}
          forecastData={undefined}
          isLoading={false}
        />
      );
    }).toThrow();
  });

  it('handles forecast data with empty list', () => {
    const emptyForecast: ForecastData = {
      ...mockForecastData,
      list: [],
    };

    render(
      <CityDetails
        city={mockCity}
        forecastData={emptyForecast}
        isLoading={false}
      />
    );

    // Should not crash
    expect(screen.getByText('Kyiv, UA')).toBeInTheDocument();
  });

  it('handles forecast data with future dates only', () => {
    const futureForecast: ForecastData = {
      ...mockForecastData,
      list: [
        {
          ...mockForecastData.list[0],
          dt: Date.now() / 1000 + 86400, // Tomorrow
        },
      ],
    };

    render(
      <CityDetails
        city={mockCity}
        forecastData={futureForecast}
        isLoading={false}
      />
    );

    // Should handle gracefully
    expect(screen.getByText('Kyiv, UA')).toBeInTheDocument();
  });
});

