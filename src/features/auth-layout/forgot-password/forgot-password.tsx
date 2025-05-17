import React from "react";
import Input from "@component/input/input";
import Button from "@component/button/button";
import { Link } from "react-router-dom";
import "./forgot-password.scss";

const ForgotPassword = ({
  onBackToSignIn,
}: {
  onBackToSignIn?: () => void;
}) => {
  return (
    <div className="login-box">
      <div className="form-title">Forgot Your Password</div>
      <div className="form-subtitle">
        Enter your registered email below and we will send an email with
        instructions to reset your password.
      </div>
      <form>
        <Input placeholder="Email" className="mb-3" />
        <Button type="submit" className="mt-2" text="Send" />
      </form>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Link to="/login" className="forgot-link">
          Back To Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
