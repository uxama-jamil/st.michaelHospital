import React from 'react';
import ReactDOM from 'react-dom/client';
import '@assets/scss/main.scss';
import { App as AntdApp } from 'antd';

import App from './App';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </React.StrictMode>,
);