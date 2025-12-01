'use client';

import { ForecastData } from '@/types/weather';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './CityDetails.module.scss';

interface HourlyChartProps {
  forecastData: ForecastData;
  isLoading: boolean;
}

export function HourlyChart({
  forecastData,
  isLoading,
}: HourlyChartProps) {
  if (isLoading || !forecastData) {
    return (
      <div className={styles.chartContainer}>
        <p>Loading forecast data...</p>
      </div>
    );
  }

  // Filter data for current day (next 24 hours)
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const chartData = forecastData.list
    .filter((item) => {
      const itemDate = new Date(item.dt * 1000);
      return itemDate >= today && itemDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000);
    })
    .map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temperature: Math.round(item.main.temp),
      fullTime: new Date(item.dt * 1000),
    }))
    .slice(0, 8); // Show first 8 data points (24 hours in 3-hour intervals)

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>24-Hour Temperature Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}°C`, 'Temperature']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#667eea"
            strokeWidth={2}
            dot={{ fill: '#667eea', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

