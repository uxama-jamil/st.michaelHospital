import React from 'react';
import { Button } from 'antd';
import type { ButtonType, ButtonSize } from 'antd/es/button';
import styles from './style.module.scss';
import { ButtonType as AntButtonType } from '@/constants/button';

interface CustomButtonProps {
  text?: string;
  type?: ButtonType | any;
  size?: ButtonSize;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  block?: boolean;
  // Add any other Ant Button props you need
  [key: string]: any; // This allows for any additional props
}

const AntButton: React.FC<CustomButtonProps> = ({
  text,
  type = 'primary',
  onClick,
  disabled = false,
  style,
  className = '',
  children,
  block = false,
  loading = false,
  ...rest
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`
        ${styles.button}
        ${type === AntButtonType.DEFAULT ? styles.defaultButton : type === AntButtonType.SECONDARY ? styles.secondaryButton : type === AntButtonType.SECONDARY_WHITE ? styles.secondaryWhiteButton : styles.primaryButton}
        ${className}
      `}
      block={block}
      loading={loading}
      {...rest}
    >
      {children || text}
    </Button>
  );
};

export default AntButton;
