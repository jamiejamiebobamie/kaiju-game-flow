import React from "react";
import styled from "styled-components";

const Monster = styled.i`
  position: absolute;
  display: ${props =>
    props.charLocation.x < 0 ||
    props.charLocation.x > 490 ||
    props.charLocation.y < 30 ||
    props.charLocation.y > 800
      ? "none"
      : "block"}
  z-index: 20001;
  left: ${props => `${props.charLocation.x}px`};
  top: ${props => `${props.charLocation.y}px`};
  width: 10px;
  height: 10px;
  color: ${props => props.color};
}
`;
export const Kaiju = ({ charLocation, element, color }) => {
  return (
    <Monster
      className="fa fa-optin-monster"
      charLocation={charLocation}
      color={color}
    />
  );
};
