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
  return (
    <CButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`gradient-button${className ? " " + className : ""}`}
    >
      {children || text}
    </CButton>
  );
};

export default Button;
