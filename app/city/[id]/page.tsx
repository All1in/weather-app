'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CityDetails } from '@/components/CityDetails';
import { WeatherBackground } from '@/components/WeatherBackground';
import { useCityStore } from '@/store/useCityStore';
import { weatherApi } from '@/lib/weather-api';
import styles from './page.module.scss';

export default function CityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cityId = params.id as string;
  const cities = useCityStore((state) => state.cities);
  const city = cities.find((c) => c.id === cityId);

  const { data: forecastData, isLoading } = useQuery({
    queryKey: ['hourly-forecast', city?.name],
    queryFn: () => weatherApi.getHourlyForecast(city!.name),
    enabled: !!city,
  });

  if (!city) {
    return (
      <div className={styles.notFound}>
        <h2>City not found</h2>
        <button onClick={() => router.push('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <WeatherBackground weatherData={city.weatherData} />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => router.push('/')}>
          ← Back to Cities
        </button>
        <CityDetails city={city} forecastData={forecastData} isLoading={isLoading} />
      </div>
    </main>
  );
}

