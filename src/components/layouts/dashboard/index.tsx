import { Header, Sidebar, AppContent } from '@/components/global';
import { useHeader } from '@/context/header';
import { Layout as AntdLayout } from 'antd';
function Layout({ children }) {
  const header = useHeader();

  return (
    <AntdLayout className="app-layout">
      <Sidebar />
      <AntdLayout className="content-layout">
        <Header {...header} />
        <AppContent> {children}</AppContent>
      </AntdLayout>
    </AntdLayout>
  );
}

export default Layout;
