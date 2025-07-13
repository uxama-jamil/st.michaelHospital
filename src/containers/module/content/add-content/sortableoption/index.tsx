import { Input } from '@/components/ui';

import { Checkbox, Col, Row } from 'antd';
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import styles from '../style.module.scss';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableOption = ({
  id,
  option,
  onDelete,
  onChange,
  listeners,
  attributes,
  setNodeRef,
  style,
  inputRef,
}) => {
  return (
    <Row ref={setNodeRef} style={style} className={styles.optionContainer} {...attributes}>
      <Col span={1}>
        <Checkbox value={id} />
      </Col>
      <Col span={17}>
        <Input
          ref={inputRef}
          value={option.optionValue}
          className={styles.optionInput}
          onChange={(e) => onChange(id, e.target.value)}
        />
      </Col>
      <Col span={2}>
        <EllipsisOutlined className={styles.ellipsis} {...listeners} />
      </Col>
      <Col span={2}>
        <DeleteOutlined className={styles.delete} onClick={() => onDelete(id)} />
      </Col>
    </Row>
  );
};

export const SortableItemWrapper = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  return children({ id, attributes, listeners, setNodeRef, style });
};
