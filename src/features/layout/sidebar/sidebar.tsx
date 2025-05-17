import React from "react";
import {
  CSidebar,
  CSidebarNav,
  CNavTitle,
  CNavGroup,
  CButton,
  CAvatar,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilPuzzle,
  cilUser,
  cilPlaylistAdd,
  cilLockLocked,
} from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import playlist from "@assets/svg/playlist.svg";
import user from "@assets/svg/user.svg";
import module from "@assets/svg/module.svg";
import shutter from "@assets/svg/shutterstock.svg";
import "./sidebar.scss";
const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-wrapper">
      <img className="shutter" src={shutter} width={609} height={837} />

      <div className="navigations">
        <h2>MyEndo</h2>
        <div className="navs" onClick={() => navigate("/module")}>
          <img src={module} className="me-2" />
          Modules Mgmt.
        </div>

        <div className="navs" onClick={() => navigate("/user")}>
          <img src={user} className="me-2" />
          User Mgmt.
        </div>

        <div className="navs" onClick={() => navigate("/playlist")}>
          <img src={playlist} className="me-2" />
          Playlist
        </div>
      </div>
      <div>
        <div className="mt-4 px-3">
          <CIcon icon={cilLockLocked} className="me-2" />
          <small className="text-muted">Reset Password</small>
        </div>

        <hr />

        <div className="mt-auto px-3 py-4 d-flex align-items-center">
          <CAvatar
            src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
            size="md"
            className="me-2"
          />

          <div>
            <strong>Culaccino_CCN</strong>
            <br />
            <small>@marry_jane</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
