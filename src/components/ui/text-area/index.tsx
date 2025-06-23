import { Input } from 'antd';
import styles from './style.module.scss';

interface Props {
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  [key: string]: any;
}

const AntTextArea: React.FC<Props> = ({
  label,
  required,
  error,
  className = styles.antTextArea,
  value,
  onChange,
  placeholder,
  rows = 4,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label>
          {label}
          {required && <span className='error'>*</span>}
        </label>
      )}
      <Input.TextArea
        rows={rows}
        status={error && required ? 'error' : ''}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        style={{
          resize: 'none',
        }}
        {...rest}
      />
      {error && required && <p className={'error'}>{error}</p>}
    </div>
  );
};

export default AntTextArea;
