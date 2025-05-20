import Sidebar from "./sidebar/sidebar";
import "./layout.scss";
import Header from "@/features/layout/header/header";
import { useHeader } from "@/context/headerContext";

function Layout({ children }) {
  const header = useHeader();
  return (
    <div className="d-flex layout">
      <Sidebar />
      <div className="flex-grow-1 bg-light min-vh-100 main-container">
        <Header {...header} />
        {children}
      </div>
    </div>
  );
}

export default Layout;
