import "./empty.scss";

import emptyImage from "@assets/svg/empty.svg";
import Button from "../button/button";

export const Empty = ({
  heading,
  message,
  buttonText,
  onClick,
  btnStyle = {},
}) => {
  return (
    <div className="empty-state monstserrat">
      <img src={emptyImage} alt="No Question" />
      <h5>{heading}</h5>
      <p>{message}</p>
      <Button className={"button-css"} onClick={onClick} style={btnStyle}>
        {buttonText}
      </Button>
    </div>
  );
};
