// components/GenericDropdown.js
import React from "react";
import { CFormLabel, CFormSelect } from "@coreui/react";

const Dropdown = ({
  label,
  required = false,
  options = [],
  value,
  onChange,
  placeholder = "Select",
  name,
}) => (
  <div className="c-dropdown-container">
    {label && (
      <label className="c-dropdown-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
    )}
    <CFormSelect
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">
        {placeholder} {label}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </CFormSelect>
  </div>
);

export default Dropdown;
