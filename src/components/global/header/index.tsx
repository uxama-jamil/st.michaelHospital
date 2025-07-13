import React, { type ReactNode } from 'react';
import { Layout, Row, Col, Breadcrumb } from 'antd';
import styles from './style.module.scss';

interface Breadcrumb {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface HeaderProps {
  title: string;
  subtitle?: string | ReactNode;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode[];
  children?: React.ReactNode;
  rightAlign?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  rightAlign = true,
  className = '',
}) => {
  const { Header: AntHeader } = Layout;
  return (
    <>
      <AntHeader className={`${styles.appHeader} ${className}`}>
        <Row justify="space-between" align="middle">
          <Col>
            <Row align="middle">
              <Col span={24}>
                <Row align={'middle'} gutter={[8, 0]} className={styles.headerTitleContainer}>
                  <Col className="d-inline-flex ">
                    <h2>{title}</h2>
                  </Col>
                  <Col className={styles.subtitle}>
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                {breadcrumbs.length > 0 && (
                  <Breadcrumb
                    className={styles.breadcrumbs}
                    items={breadcrumbs.map((item, index) => ({
                      key: `breadcrumb-${index}`,
                      title: (
                        <span
                          className={`header-breadcrumb-item${item.active ? ' active' : ''}`}
                          onClick={item.onClick}
                          style={{ cursor: item.onClick ? 'pointer' : 'default' }}
                        >
                          {item.label}
                        </span>
                      ),
                    }))}
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col>
            {actions.length > 0 && (
              <div className={`c-header-actions${rightAlign ? ' right' : ''}`}>
                <Row gutter={16}>
                  {actions.map((a, i) => (
                    <Col key={i}>
                      <span>{a}</span>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </AntHeader>
    </>
  );
};

export default Header;
