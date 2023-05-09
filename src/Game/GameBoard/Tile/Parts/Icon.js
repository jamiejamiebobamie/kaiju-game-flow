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
  ${props => `filter: drop-shadow(0 0 1px ${props.color});`}
  ${props => props.className === "fa fa-free-code-camp" && "margin-left: -7px;"}
  ${props => props.className === "fa fa-shield" && "margin-left: 5px;"}
  ${props => props.className === "fa fa-bolt" && "margin-left: 10px;"}

`;

export const Icon = ({ color, className, zIndex }) => {
  return (
    <StyledIcon
      className={`fa ${className}`}
      zIndex={zIndex + 1}
      color={color}
    />
  );
};
