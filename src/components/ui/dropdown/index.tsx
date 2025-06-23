// components/form/MultiSelect.tsx
import { Select } from 'antd';
import styles from './style.module.scss';

interface Props {
  label?: string;
  required?: boolean;
  error?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  [key: string]: any;
}

const AntDropdown: React.FC<Props> = ({
  label,
  required,
  error,
  options,
  className = styles.antSelect,
  placeholder,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.error}>*</span>}
        </label>
      )}
      <Select
        mode={rest.multiple ? 'multiple' : undefined}
        allowClear
        options={options}
        placeholder={placeholder}
        className={className}
        status={error && required ? 'error' : ''}
        {...rest}
      />
      {error && required && <p className={'error'}>{error}</p>}
    </div>
  );
};

export default AntDropdown;
