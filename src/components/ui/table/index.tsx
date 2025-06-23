// components/shared/Table.tsx
import React, { useEffect, useState } from 'react';
import { Table as AntTable, Pagination, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import type { ReactNode } from 'react';
import style from './style.module.scss'; // Assuming you have a CSS module for styles

type Props<T> = {
  columns: TableProps<T>['columns'];
  data: T[];
  rowKey: string;
  showPagination?: boolean;
  total?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  extraContent?: ReactNode;
  loading?: boolean;
  locale?: {
    emptyText?: ReactNode;
  };
};

const Table = <T extends object>({
  columns,
  data,
  rowKey,
  showPagination = false,
  total = 0,
  pageSize = 6,
  currentPage = 1,
  onPageChange,
  extraContent,
  loading = false,
  locale = { emptyText: 'No data' },
}: Props<T>) => {
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const calculateHeight = () => {
      // Adjust offset as needed for your header/footer/other elements
      const offset = 220; // Example: header + footer + paddings
      setTableHeight(window.innerHeight - offset);
    };
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  return (
    <Row gutter={[16, 16]} justify={'end'}>
      <Col span={24}>
        {extraContent}
        <AntTable
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey={rowKey}
          bordered={true}
          loading={loading}
          className={style.table}
          locale={locale}
          scroll={tableHeight ? { y: tableHeight } : undefined}
        />
      </Col>
      {showPagination && (
        <Col span={24}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={onPageChange}
            className={style.tablePagination}
          />
        </Col>
      )}
    </Row>
  );
};

export default Table;
