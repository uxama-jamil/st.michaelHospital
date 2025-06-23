import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const AppContent: React.FC = ({ children }) => {
  return (
    <Content className="app-content">
      {children}
    </Content>
  );
};

export default AppContent;
