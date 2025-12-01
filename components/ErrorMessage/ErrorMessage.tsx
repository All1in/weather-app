'use client';

import { Close } from '@mui/icons-material';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  return (
    <div className={styles.error}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">
        <Close />
      </button>
    </div>
  );
}

