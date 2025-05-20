import Input from "@components/input/input";
import Button from "@components/button/button";
import { Link } from "react-router-dom";
import emailIcon from "@assets/svg/email-sent.svg";
import "../forgot-password.scss";
import { useState } from "react";

const EmailSent = () => {
  const [email, setEmail] = useState("");

  return (
    <div
      className="login-box"
      style={{ maxWidth: 420, padding: "2.5rem 2rem 2rem 2rem" }}
    >
      <div className="email-sent-container">
        <div
          style={{ display: "flex", justifyContent: "left", marginBottom: 16 }}
        >
          <img
            src={emailIcon}
            alt="email sent"
            style={{ width: 80, height: 80 }}
          />
        </div>
        <div className="form-title">Email Has Been Sent!</div>
        <div className="form-subtitle">
          Please check your inbox and click on the received link to reset your
          password
        </div>
        <form>
          <Input
            placeholder="Email"
            className="mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="button" text="Go to Sign In" className="mb-2" />
        </form>
      </div>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 14 }}>
        Didn't receive link?{" "}
        <span style={{ color: "#5B2E91", fontWeight: 600, cursor: "pointer" }}>
          Resend
        </span>
      </div>
    </div>
  );
};

export default EmailSent;
