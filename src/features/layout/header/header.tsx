import React, { type ReactNode } from "react";
import "./Header.scss";

interface Breadcrumb {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface HeaderProps {
  title: string;
  subtitle?: string | ReactNode;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode[];
  children?: React.ReactNode;
  rightAlign?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  children,
  rightAlign = true,
  className = "",
}) => {
  return (
    <div className={`c-header-container${className ? " " + className : ""}`}>
      <div className="c-header-row">
        <div className="c-header-main">
          <div className="c-header-title-row">
            <span className="c-header-title">{title}</span>
            {subtitle && <span className="c-header-subtitle">{subtitle}</span>}
            {children}
          </div>
          {breadcrumbs.length > 0 && (
            <div className="c-header-breadcrumbs">
              {breadcrumbs.map((bc, idx) => (
                <span
                  key={idx}
                  className={`c-header-breadcrumb${bc.active ? " active" : ""}`}
                  onClick={bc.onClick}
                  style={{ cursor: bc.onClick ? "pointer" : "default" }}
                >
                  {bc.label}
                  {idx < breadcrumbs.length - 1 && (
                    <span className="c-header-breadcrumb-sep">|</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        {actions.length > 0 && (
          <div className={`c-header-actions${rightAlign ? " right" : ""}`}>
            {actions.map((a, i) => (
              <span key={i}>{a}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
