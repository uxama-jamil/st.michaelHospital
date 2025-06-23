import emptyImage from '@assets/svg/empty.svg';
import { Button } from '@/components/ui';
import styles from './style.module.scss';

const Empty = ({ heading, message, buttonText, onClick }) => {
  return (
    <div className={styles.emptyState}>
      <img src={emptyImage} alt="No Question" />
      <div className={styles.emptyContent}>
        <h2>{heading}</h2>
        <p>{message}</p>
      </div>
      {buttonText && (
        <Button size="small" onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default Empty;
