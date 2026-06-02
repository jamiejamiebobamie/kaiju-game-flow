import React from "react";
import styled from "styled-components";

const StyledIcon = styled.i`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 100%;
  height: 100%;
  // transform: scale(3) translate(19px, 15px);
  // transform: scale(3) translate(-5px, 2px);
  // transform: scale(3) translate(-4px, 2px);

  transform: scale(3);// translate(-13px, 27px);

  pointer-events: none;
  color: ${props => props.color};
  ${props => props.className === "fa fa-free-code-camp" && "margin-left: -7px;"}
  ${props => props.className === "fa fa-shield" && "margin-left: 5px;"}
  ${props => props.className === "fa fa-bolt" && "margin-left: 10px;"}

  &::before{
      position: absolute;
      transform: rotate(${props => props.rotation}deg);
`;


export const Icon = ({ color, className, zIndex, rotation }) => (
  <StyledIcon
    className={`fa ${className}`}
    zIndex={zIndex + 1}
    color={color}
    rotation={rotation}
  />);
