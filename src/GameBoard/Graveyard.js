import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getRandomIntInRange } from "./../Utils/utils";

const GraveYardDot = styled.div`
  position: absolute;
  z-index: 10001;
  left: ${props => `${props.x}px`};
  top: ${props => `${props.y}px`};
  width: 10px;
  height: 10px;
  background-color: ${props => (props.isEndgame ? "yellow" : "transparent")};
  /* opacity: ${props => (props.isEndgame ? 0.7 : 1)}; */

  border-radius: 30px;
  border-style: solid;
  border-width: medium;
  border-color: ${props => (props.isEndgame ? "grey" : "lightgrey")};
  display: ${props =>
    props.isEndgame || props.gravestoneCount > 0 ? "block" : "none"};
  pointer-events: none;
`;
export const Graveyard = ({ x, y, isEndgame }) => {
  const [gravestones, setGravestones] = useState(0);
  useEffect(() => {
    const randomInt = getRandomIntInRange({ max: 3, min: 2 });
    setGravestones(randomInt);
  }, []);
  const decrementGravestones = () => {
    setGravestones(count => count - 1);
  };
  return (
    <GraveYardDot
      x={x}
      y={y}
      gravestoneCount={gravestones}
      isEndgame={isEndgame}
    />
  );
};
