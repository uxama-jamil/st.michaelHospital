import React from "react";
import Input from "@component/input/input";
import Button from "@component/button/button";
import { Link } from "react-router-dom";

const Loginform = () => {
  return (
    <div className="login-box">
      <div className="form-title">Sign In</div>
      <div className="form-subtitle">
        Enter your credentials to sign in to your account
      </div>
      <form>
        <Input placeholder="Email" className="mb-3" />
        <Input type="password" placeholder="Password" className="mb-2" />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="mt-2" text="Sign In" />
      </form>
    </div>
  );
};

export default Loginform;
