import React, { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.i`
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
const Character = styled.img`
    margin-left: -20px;
    margin-top: -45px;
    width: 50px;
    height: 75px;
    position: absolute;
    z-index: 1;
  ${props => props.isInManaPool && "animation: blinking 5s infinite;"}
  pointer-events: none;
}
@keyframes blinking{
  0%		{filter: invert(25%);}
  25%		{filter: invert(100%);}
  50%		{filter: invert(50%);}
  75%		{filter: invert(100%);}
  100%	{filter: invert(25%);}
}
`;
// ${props => props.color === "blue" && "filter: invert(100%);"};

// @keyframes blinking{
//   0%		{color: #10c018;}
//   25%		{color: #1056c0;}
//   50%		{color: #ef0a1a;}
//   75%		{color: #254878;}
//   100%	{color: #04a1d5;}
// }
export const Player = ({ charLocation, isInManaPool, color, i = 0 }) => {
  return (
    <Wrapper charLocation={charLocation}>
      <Character
        color={color}
        isInManaPool={isInManaPool}
        src={color === "blue" ? "player.png" : "enemy.png"}
      />
    </Wrapper>
  );
};
// <Character
// className="fa fa-male"
//   charLocation={charLocation}
//   color={color}
//   isInManaPool={isInManaPool}
// />

// <img
//   style={{
//     marginLeft: "-30px",
//     marginTop: "-40px",
//     width: "50px",
//     height: "75px",
//     position: "absolute",
//     zIndex: 1
//   }}
//   src="test1.png"
// />
