'use client';

import { useMemo } from 'react';
import { WeatherData } from '@/types/weather';
import styles from './WeatherBackground.module.scss';

interface WeatherBackgroundProps {
  weatherData?: WeatherData;
}

export function WeatherBackground({ weatherData }: WeatherBackgroundProps) {
  const weatherCondition = weatherData?.weather[0]?.main || 'Clear';

  const isRainy = weatherCondition.includes('Rain') || weatherCondition.includes('Drizzle');
  const isSnowy = weatherCondition.includes('Snow');
  const isCloudy = weatherCondition.includes('Cloud') || weatherCondition.includes('Fog') || weatherCondition.includes('Mist');
  const isClear = weatherCondition.includes('Clear');

  const backgroundClass = useMemo(() => {
    if (isRainy) return styles.rainy;
    if (isSnowy) return styles.snowy;
    if (isCloudy) return styles.cloudy;
    return styles.clear;
  }, [isRainy, isSnowy, isCloudy]);

  return (
    <div className={`${styles.background} ${backgroundClass}`}>
      {isRainy && (
        <div className={styles.rain}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={styles.raindrop}
              style={{
                left: `${(i * 2.5) % 100}%`,
                animationDelay: `${(i * 0.1) % 2}s`,
                animationDuration: `${0.6 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {isSnowy && (
        <div className={styles.snow}>
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={styles.snowflake}
              style={{
                left: `${(i * 4) % 100}%`,
                animationDelay: `${(i * 0.15) % 3}s`,
                animationDuration: `${3 + (i % 2)}s`,
              }}
            />
          ))}
        </div>
      )}

      {isCloudy && (
        <div className={styles.clouds}>
          <div className={styles.cloud} style={{ left: '10%', animationDelay: '0s' }} />
          <div className={styles.cloud} style={{ left: '50%', animationDelay: '2s' }} />
          <div className={styles.cloud} style={{ left: '80%', animationDelay: '4s' }} />
        </div>
      )}

      {isClear && (
        <div className={styles.sunRays}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={styles.ray}
              style={{ transform: `rotate(${i * 45}deg)` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

