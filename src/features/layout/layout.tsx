import Sidebar from "./sidebar/sidebar";
import "./layout.scss";

function Layout({ children }) {
  return (
    <div className="d-flex layout">
      <Sidebar />
      <div className="flex-grow-1 bg-light min-vh-100 main-container">
        {children}
      </div>
    </div>
  );
}

export default Layout;
