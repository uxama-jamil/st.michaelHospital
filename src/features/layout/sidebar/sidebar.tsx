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
import "./sidebar.scss";
import { useNavigate, useLocation } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState({
    module: false,
    user: false,
    playlist: false,
  });
  useEffect(() => {
    if (location.pathname === "/module") {
      setActive({ module: true, user: false, playlist: false });
    } else if (location.pathname === "/user") {
      setActive({ module: false, user: true, playlist: false });
    } else if (location.pathname === "/playlist") {
      setActive({ module: false, user: false, playlist: true });
    }
  }, [location.pathname]);
  const handleNav = (nav: string) => {
    if (nav === "module") {
      setActive({ module: true, user: false, playlist: false });
      navigate("/module");
    } else if (nav === "user") {
      setActive({ module: false, user: true, playlist: false });
      navigate("/user");
    } else if (nav === "playlist") {
      setActive({ module: false, user: false, playlist: true });
      navigate("/playlist");
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
      <div className="sidebar-reset">
        <img src={lock} alt="lock" className="reset-icon" />
        Reset Password
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
        <img src={logout} alt="logout" className="logout-icon" />
      </div>
    </div>
  );
};

export default Sidebar;
