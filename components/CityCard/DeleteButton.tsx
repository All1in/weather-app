'use client';

import { Delete } from '@mui/icons-material';
import { useCityStore } from '@/store/useCityStore';
import styles from './CityCard.module.scss';

interface DeleteButtonProps {
  cityId: string;
}

export function DeleteButton({ cityId }: DeleteButtonProps) {
  const removeCity = useCityStore((state) => state.removeCity);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this city?')) {
      removeCity(cityId);
    }
  };

  return (
    <button
      className={styles.deleteButton}
      onClick={handleDelete}
      aria-label="Delete city"
    >
      <Delete />
    </button>
  );
}

