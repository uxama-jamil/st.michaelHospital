import React, { useState } from "react";
import { CFormInput } from "@coreui/react";
import eye from "@assets/svg/eye.svg";
import "./input.scss";

interface InputProps extends React.ComponentProps<typeof CFormInput> {
  type?: string;
}

const Input: React.FC<InputProps> = (props) => {
  const { type = "text", label = "", ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="c-input-container">
      {label && (
        <label className="c-input-label">
          {label}
          {props.required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="c-input-container-input">
        <CFormInput type={inputType} {...rest} />
        {isPassword && (
          <button
            type="button"
            className="input-icon-btn"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
          >
            <img src={eye} alt="eye" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
