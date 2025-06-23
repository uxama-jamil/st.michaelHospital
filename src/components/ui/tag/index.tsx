import React from 'react';
import { Tag as AntdTag } from 'antd';
import styles from './style.module.scss';

type TagVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  onClick?: () => void;
}

function Tag({ children, variant = 'primary', onClick }: TagProps) {
  // Map variant to CSS module className (avoid using AntD color prop)
  const variantClass = styles[variant] || '';

  return (
    <AntdTag
      className={`${styles.tag} ${variantClass}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </AntdTag>
  );
}

export default Tag;
