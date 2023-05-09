import React from "react";
import styled from "styled-components";

const StyledIcon = styled.i`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 100%;
  height: 100%;
  transform: scale(3) translate(19px, 15px);
  pointer-events: none;
  color: ${props => props.color};
  ${props => `filter: drop-shadow(0 0 5px ${props.color});`}
  ${props => props.className === "fa fa-free-code-camp" && "margin-left: -7px;"}
  ${props => props.className === "fa fa-shield" && "margin-left: 5px;"}



`;
// -webkit-transform: scale(3) translate(20px, 15px);
// -moz-transform: scale(3) translate(20px, 15px);
// -ms-transform: scale(3) translate(20px, 15px);
// -o-transform: scale(3) translate(20px, 15px);

export const Icon = ({ color, className, zIndex }) => {
  return (
    <StyledIcon
      className={`fa ${className}`}
      zIndex={zIndex + 1}
      color={color}
    />
  );
};
