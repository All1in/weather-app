import { render, screen } from '@testing-library/react';
import { HourlyChart } from '../HourlyChart';
import { ForecastData } from '@/types/weather';

describe('HourlyChart', () => {
  const createMockForecastData = (hoursAhead: number = 0): ForecastData => {
    const baseTime = Date.now() / 1000 + hoursAhead * 3600;
    return {
      cod: '200',
      message: 0,
      cnt: 8,
      list: Array.from({ length: 8 }, (_, i) => ({
        dt: baseTime + i * 3 * 3600, // 3-hour intervals
        main: {
          temp: 20 + i,
          feels_like: 19 + i,
          temp_min: 18 + i,
          temp_max: 22 + i,
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
        dt_txt: new Date((baseTime + i * 3 * 3600) * 1000).toISOString(),
      })),
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
  };

  it('renders chart when forecast data is provided', () => {
    const forecastData = createMockForecastData(0);

    render(
      <HourlyChart forecastData={forecastData} isLoading={false} />
    );

    expect(
      screen.getByText('24-Hour Temperature Forecast')
    ).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <HourlyChart forecastData={undefined} isLoading={true} />
    );

    expect(screen.getByText('Loading forecast data...')).toBeInTheDocument();
  });

  it('shows loading state when forecast data is missing', () => {
    render(
      <HourlyChart forecastData={undefined} isLoading={false} />
    );

    expect(screen.getByText('Loading forecast data...')).toBeInTheDocument();
  });

  it('handles forecast data with only future dates', () => {
    const forecastData = createMockForecastData(24); // 24 hours in future

    render(
      <HourlyChart forecastData={forecastData} isLoading={false} />
    );

    // Should handle gracefully - might not show chart if no data for today
    expect(
      screen.queryByText('24-Hour Temperature Forecast')
    ).not.toBeInTheDocument();
  });

  it('handles forecast data with mixed past and future dates', () => {
    const forecastData = createMockForecastData(-3); // 3 hours ago

    render(
      <HourlyChart forecastData={forecastData} isLoading={false} />
    );

    // Should filter and show relevant data
    expect(
      screen.getByText('24-Hour Temperature Forecast')
    ).toBeInTheDocument();
  });

  it('handles empty forecast list', () => {
    const emptyForecast: ForecastData = {
      cod: '200',
      message: 0,
      cnt: 0,
      list: [],
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

    const { container } = render(
      <HourlyChart forecastData={emptyForecast} isLoading={false} />
    );

    // Should not render chart when no data
    expect(
      screen.queryByText('24-Hour Temperature Forecast')
    ).not.toBeInTheDocument();
  });

  it('handles negative temperatures in forecast', () => {
    const coldForecast: ForecastData = {
      ...createMockForecastData(0),
      list: [
        {
          dt: Date.now() / 1000,
          main: {
            temp: -15,
            feels_like: -18,
            temp_min: -20,
            temp_max: -10,
            pressure: 1013,
            humidity: 65,
          },
          weather: [
            {
              id: 600,
              main: 'Snow',
              description: 'light snow',
              icon: '13d',
            },
          ],
          clouds: { all: 75 },
          wind: { speed: 5, deg: 270 },
          visibility: 5000,
          pop: 0.8,
          dt_txt: new Date().toISOString(),
        },
      ],
    };

    render(
      <HourlyChart forecastData={coldForecast} isLoading={false} />
    );

    expect(
      screen.getByText('24-Hour Temperature Forecast')
    ).toBeInTheDocument();
  });

  it('handles very high temperatures in forecast', () => {
    const hotForecast: ForecastData = {
      ...createMockForecastData(0),
      list: [
        {
          dt: Date.now() / 1000,
          main: {
            temp: 45.5,
            feels_like: 48.2,
            temp_min: 40,
            temp_max: 50,
            pressure: 1013,
            humidity: 30,
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
          wind: { speed: 2, deg: 180 },
          visibility: 10000,
          pop: 0,
          dt_txt: new Date().toISOString(),
        },
      ],
    };

    render(
      <HourlyChart forecastData={hotForecast} isLoading={false} />
    );

    expect(
      screen.getByText('24-Hour Temperature Forecast')
    ).toBeInTheDocument();
  });

  it('filters data correctly for current day only', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime() / 1000;

    const forecastData: ForecastData = {
      cod: '200',
      message: 0,
      cnt: 10,
      list: [
        // Yesterday
        {
          dt: todayStart - 3600,
          main: { temp: 15, feels_like: 14, temp_min: 14, temp_max: 16, pressure: 1013, humidity: 65 },
          weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }],
          clouds: { all: 0 },
          wind: { speed: 3, deg: 180 },
          visibility: 10000,
          pop: 0,
          dt_txt: new Date((todayStart - 3600) * 1000).toISOString(),
        },
        // Today
        {
          dt: todayStart + 3600,
          main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1013, humidity: 65 },
          weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }],
          clouds: { all: 0 },
          wind: { speed: 3, deg: 180 },
          visibility: 10000,
          pop: 0,
          dt_txt: new Date((todayStart + 3600) * 1000).toISOString(),
        },
        // Tomorrow
        {
          dt: todayStart + 25 * 3600,
          main: { temp: 18, feels_like: 17, temp_min: 16, temp_max: 20, pressure: 1013, humidity: 65 },
          weather: [{ id: 800, main: 'Clear', description: 'clear', icon: '01d' }],
          clouds: { all: 0 },
          wind: { speed: 3, deg: 180 },
          visibility: 10000,
          pop: 0,
          dt_txt: new Date((todayStart + 25 * 3600) * 1000).toISOString(),
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

    render(
      <HourlyChart forecastData={forecastData} isLoading={false} />
    );

    // Should only show today's data
    expect(
      screen.getByText('24-Hour Temperature Forecast')
    ).toBeInTheDocument();
  });
});

