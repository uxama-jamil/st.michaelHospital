import React, { useState } from 'react';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { sanitizeInput } from '@/utils/sanitize';

interface InputProps extends React.ComponentProps<typeof Input> {
  type?: string;
  eye?: boolean;
  error?: string;
  label?: string;
}

const AntInput: React.FC<InputProps> = (props) => {
  const {
    type = 'text',
    label = '',
    eye = false,
    error,
    required,
    onChange,
    className = styles.antInput,
    ...rest
  } = props;
  const [showPassword] = useState(false);

  const isPassword = type === 'password' && eye;
  const inputType = isPassword && showPassword ? 'text' : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    e.target.value = sanitizedValue;
    onChange?.(e);
  };

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.error}>*</span>}
        </label>
      )}

      {isPassword ? (
        <Input.Password
          placeholder="input password"
          className={className}
          status={error && required ? 'error' : ''}
          {...rest}
          onChange={handleChange}
          iconRender={(visible) => eye && (!visible ? <EyeInvisibleOutlined /> : <EyeOutlined />)}
        />
      ) : (
        <Input
          className={className}
          type={inputType}
          onChange={handleChange}
          {...rest}
          status={error && required ? 'error' : ''}
        />
      )}
      {error && required && <p className={'error'}>{error}</p>}
    </div>
  );
};

export default AntInput;
