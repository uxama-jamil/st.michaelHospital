import React, { useEffect, useState } from "react";
import {
  FaThLarge,
  FaUsers,
  FaList,
  FaUnlockAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import user from "@assets/svg/user.svg";
import playlist from "@assets/svg/playlist.svg";
import module from "@assets/svg/module.svg";
import user_active from "@assets/svg/user-active.svg";
import playlist_active from "@assets/svg/playlist-active.svg";
import module_active from "@assets/svg/module-active.svg";
import logout from "@assets/svg/logout.svg";
import lock from "@assets/svg/lock.svg";
import lock_active from "@assets/svg/lock-active.svg";
import "./sidebar.scss";
import { useNavigate, useLocation } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState({
    module: false,
    user: false,
    playlist: false,
    resetPassword: false,
  });
  useEffect(() => {
    if (
      [
        "/module",
        "/add-module",
        "/edit-module",
        "/content",
        "/add-content",
        "/edit-content",
      ].includes(location.pathname)
    ) {
      setActive({
        module: true,
        user: false,
        playlist: false,
        resetPassword: false,
      });
    } else if (
      ["/user", "/add-user", "/edit-user"].includes(location.pathname)
    ) {
      setActive({
        module: false,
        user: true,
        playlist: false,
        resetPassword: false,
      });
    } else if (
      ["/playlist", "/add-playlist", "/edit-playlist"].includes(
        location.pathname
      )
    ) {
      setActive({
        module: false,
        user: false,
        playlist: true,
        resetPassword: false,
      });
    } else if (location.pathname === "/reset-password") {
      setActive({
        module: false,
        user: false,
        playlist: false,
        resetPassword: true,
      });
    }
  }, [location.pathname]);
  const handleNav = (nav: string) => {
    if (nav === "module") {
      setActive({
        module: true,
        user: false,
        playlist: false,
        resetPassword: false,
      });
      navigate("/module");
    } else if (nav === "user") {
      setActive({
        module: false,
        user: true,
        playlist: false,
        resetPassword: false,
      });
      navigate("/user");
    } else if (nav === "playlist") {
      setActive({
        module: false,
        user: false,
        playlist: true,
        resetPassword: false,
      });
      navigate("/playlist");
    } else if (nav === "resetPassword") {
      setActive({
        module: false,
        user: false,
        playlist: false,
        resetPassword: true,
      });
      navigate("/reset-password");
    }
  };
  return (
    <div className="sidebar ">
      <div className="sidebar-header">
        <h2>MyEndo</h2>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${active.module ? "active" : ""}`}
          onClick={() => handleNav("module")}
        >
          <img
            src={active.module ? module_active : module}
            alt="module"
            className="nav-icon"
          />
          Modules Mgmt.
        </button>
        <button
          className={`nav-item ${active.user ? "active" : ""}`}
          onClick={() => handleNav("user")}
        >
          <img
            src={active.user ? user_active : user}
            alt="user"
            className="nav-icon"
          />
          User Mgmt.
        </button>
        <button
          className={`nav-item ${active.playlist ? "active" : ""}`}
          onClick={() => handleNav("playlist")}
        >
          <img
            src={active.playlist ? playlist_active : playlist}
            alt="playlist"
            className="nav-icon"
          />
          Playlist
        </button>
      </nav>
      <div className="rp-container" style={{ padding: "0 16px" }}>
        <div
          className={`sidebar-reset ${active.resetPassword ? "active" : ""}`}
          onClick={() => handleNav("resetPassword")}
        >
          <img
            src={active.resetPassword ? lock_active : lock}
            alt="lock"
            className="reset-icon"
          />
          Reset Password
        </div>
      </div>

      <div className="sidebar-profile">
        <img
          src="https://placehold.co/48x48"
          width={48}
          height={48}
          alt="profile"
          className="profile-img"
        />
        <div>
          <div className="profile-name">Culaccino_CCN</div>
          <div className="profile-username">@marry_jane</div>
        </div>
        <img
          src={logout}
          alt="logout"
          className="logout-icon"
          onClick={() => {
            navigate("/login");
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
