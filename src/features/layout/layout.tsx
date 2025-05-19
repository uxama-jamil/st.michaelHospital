import Sidebar from "./sidebar/sidebar";
import "./layout.scss";
import Header from "@/features/layout/header/header";
import Button from "@/components/button/button";
import { useHeader } from "@/context/HeaderContext";

function Layout({ children }) {
  const { title, subtitle, actions } = useHeader();
  return (
    <div className="d-flex layout">
      <Sidebar />
      <div className="flex-grow-1 bg-light min-vh-100 main-container">
        <Header title={title} subtitle={subtitle} actions={actions} />
        {children}
      </div>
    </div>
  );
}

export default Layout;
