import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppRoutes } from './routes';
import { ConfigProvider } from 'antd';
import { config } from './theme-config';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import AuthProvider from './context/auth-provider';

import { Result } from 'antd';
import MessageProvider from './context/message';

const GlobalErrorFallback = () => (
  <Result status="500" title="Something went wrong" subTitle="Please try refreshing the page." />
);

function App() {
  const router = createBrowserRouter(AppRoutes);
  return (
    <ErrorBoundary renderError={() => <GlobalErrorFallback />}>
      <ConfigProvider theme={config}>
        <AuthProvider>
          <MessageProvider>
            <RouterProvider router={router} />
          </MessageProvider>
        </AuthProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
