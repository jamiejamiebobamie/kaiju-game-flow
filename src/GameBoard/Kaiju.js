import React from "react";
import styled from "styled-components";

const Ripple = styled.div`
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.charLocation.x}px`};
  top: ${props => `${props.charLocation.y}px`};
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  border-radius: 100%;
  border-color:transparent;
  border-style:solid;
  animation: lds-ripple 3s linear infinite;
  pointer-events: none;
}
@keyframes lds-ripple {
  0% {
    width: 10;
    height: 10;
    opacity: .5;
  }
  50% {
      background-color: transparent;
      border-color:lightblue;
      margin-left:-2px;
      margin-top:-2px;
    width: 13px;
    height: 13px;
    opacity: .1;
  }
  100% {
    width: 10;
    height: 10;
    opacity: .5;
  }
`;
export const Kaiju = ({ charLocation, element, color }) => {
  return (
    <Ripple charLocation={charLocation} color={color}>
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </Ripple>
  );
};
