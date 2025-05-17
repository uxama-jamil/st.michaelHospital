import "./auth-layout.scss";
import lady from "@assets/svg/lady.svg";
import st from "@assets/svg/st.svg";
import shutter from "@assets/svg/shutterstock.svg";
import vector1 from "@assets/svg/vector1.svg";
import vector2 from "@assets/svg/vector2.svg";
import vector3 from "@assets/svg/vector3.svg";

const AuthLayout = ({ children }) => {
  return (
    <div className="login-wrapper">
      <div className="left-panel">
        <img src={lady} alt="Logo" width={183} height={349} />
        <img className="shutter" src={shutter} width={609} height={837} />

        <div className="powered-by">
          <img className="powered-logo" src={st} alt="St. Michael's" />
        </div>
      </div>

      <div className="right-panel">
        <img className="vector1" src={vector1} />
        <img className="vector2" src={vector2} />
        <img className="vector3" src={vector3} />

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
