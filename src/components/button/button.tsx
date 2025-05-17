import React from "react";
import { CButton } from "@coreui/react";
import "./button.scss";

interface ButtonProps {
  text?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  children,
}) => {
  const buttonTypeClass = text?.toLowerCase().includes("publish")
    ? "publish-button"
    : text?.toLowerCase().includes("cancel")
    ? "cancel-button"
    : "gradient-button";
  return (
    <CButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonTypeClass}${
        className ? " " + className : ""
      } montserrat main-button`}
    >
      {children || text}
    </CButton>
  );
};

export default Button;
