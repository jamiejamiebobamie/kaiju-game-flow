import React, { useEffect } from "react";
import styled from "styled-components";

const Character = styled.i`
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.charLocation.x + 3.5}px`};
  top: ${props => `${props.charLocation.y}px`};
  color: ${props => props.color};
  ${props => props.isInManaPool && "animation: blinking 5s infinite;"}
  pointer-events: none;
}
@keyframes blinking{
  0%		{color: #10c018;}
  25%		{color: #1056c0;}
  50%		{color: #ef0a1a;}
  75%		{color: #254878;}
  100%	{color: #04a1d5;}
}
`;
export const Player = ({ charLocation, isInManaPool, color, i = 0 }) => {
  useEffect(() => console.log(isInManaPool, i), [isInManaPool]);
  return (
    <Character
      className="fa fa-male"
      charLocation={charLocation}
      color={color}
      isInManaPool={isInManaPool}
    />
  );
};
