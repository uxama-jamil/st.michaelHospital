// components/form/MultiSelect.tsx
import { Select } from 'antd';
import styles from './style.module.scss';
import { sanitizeInput } from '@/utils/sanitize';

interface Props {
  label?: string;
  required?: boolean;
  error?: string;
  value?: string | number | Array<string | number>;
  onChange?: (value: string | number | Array<string | number>) => void;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  [key: string]: any;
}

const AntDropdown: React.FC<Props> = ({
  label,
  required,
  error,
  options,
  onChange,
  className = styles.antSelect,
  placeholder,
  ...rest
}) => {
  const safeOptions = options.map((opt) => ({
    label: sanitizeInput(String(opt.label)),
    value: typeof opt.value === 'string' ? sanitizeInput(opt.value) : opt.value,
  }));

  const handleChange = (val: string[]) => {
    if (Array.isArray(val)) {
      onChange?.(val.map((v) => (typeof v === 'string' ? sanitizeInput(v) : v)));
    } else {
      onChange?.(typeof val === 'string' ? sanitizeInput(val) : val);
    }
  };
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
        options={safeOptions}
        placeholder={placeholder}
        className={className}
        status={error && required ? 'error' : ''}
        onChange={handleChange}
        {...rest}
      />
      {error && required && <p className={'error'}>{error}</p>}
    </div>
  );
};

export default AntDropdown;
