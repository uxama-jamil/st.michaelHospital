import Sidebar from "./sidebar/sidebar";
import "./layout.scss";
import Header from "@/features/layout/header/header";
import Button from "@/components/button/button";

function Layout({ children }) {
  return (
    <div className="d-flex layout">
      <Sidebar />

      <div className="flex-grow-1 bg-light min-vh-100 main-container">
        <Header
          title="Modules Management"
          subtitle={
            <span>
              Total: <b>6</b>
            </span>
          }
          actions={[<Button key="add" text="Add New Module" />]}
        />
        {children}
      </div>
    </div>
  );
}

export default Layout;
