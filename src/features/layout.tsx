import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"



function Layout({children}) {
    return (
      
        <div className="d-flex layout">
          <Sidebar />
          <div className="flex-grow-1 bg-light min-vh-100">
            {children}
          </div>
        </div>
      
    )
  }
  
  export default Layout