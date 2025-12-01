'use client';

import { Refresh } from '@mui/icons-material';
import styles from './CityCard.module.scss';

interface RefreshButtonProps {
  onRefresh: (e: React.MouseEvent) => void;
  isLoading: boolean;
  lastUpdated?: number;
}

export function RefreshButton({
  onRefresh,
  isLoading,
  lastUpdated,
}: RefreshButtonProps) {
  const getTimeAgo = () => {
    if (!lastUpdated) return '';
    const seconds = Math.floor((Date.now() - lastUpdated) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <button
      className={styles.refreshButton}
      onClick={onRefresh}
      disabled={isLoading}
      aria-label="Refresh weather data"
    >
      <Refresh className={isLoading ? styles.spinning : ''} />
      <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
      {lastUpdated && (
        <span className={styles.timeAgo}>{getTimeAgo()}</span>
      )}
    </button>
  );
}

