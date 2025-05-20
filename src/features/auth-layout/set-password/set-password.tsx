import Input from "@components/input/input";
import Button from "@components/button/button";
import { Link } from "react-router-dom";
import "./set-password.scss";
import { useState } from "react";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    // TODO: handle password reset logic
  };

  return (
    <div className="login-box">
      <div
        className="form-title"
        style={{ textAlign: "center", color: "#5B2E91" }}
      >
        Set Your Password
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="New Password"
          className="mb-3"
          eye={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          className="mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && (
          <div style={{ color: "red", marginBottom: 12, textAlign: "center" }}>
            {error}
          </div>
        )}
        <Button type="submit" text="Set Password" className="mb-3" />
      </form>
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <Link to="/login" className="forgot-link">
          Back To Sign In
        </Link>
      </div>
    </div>
  );
};

export default SetPassword;
