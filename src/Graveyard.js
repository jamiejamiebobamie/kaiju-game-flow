import React, { useState, useEffect } from "react";
import styled from "styled-components";

const GraveYardDot = styled.div`
  position: absolute;
  z-index: 1001;
  left: ${props => `${props.x}px`};
  top: ${props => `${props.y}px`};
  width: 10px;
  height: 10px;
  background-color: ${props => (props.isEndgame ? "yellow" : "transparent")};
  border-radius: 30px;
  border-style: solid;
  border-width: medium;
  border-color: ${props => (props.isEndgame ? "red" : "black")};
  display: ${props =>
    props.isEndgame || props.gravestoneCount > 0 ? "block" : "none"};
`;
export const Graveyard = ({ x, y, isEndgame }) => {
  const [gravestones, setGravestones] = useState(0);
  useEffect(() => {
    setGravestones(Math.ceil(Math.random() * (3 - 2)) + 2);
  }, []);
  const decrementGravestones = () => {
    setGravestones(count => count - 1);
  };
  useEffect(() => {
    console.log("hey", gravestones);
  }, [gravestones]);
  return (
    <GraveYardDot
      x={x}
      y={y}
      gravestoneCount={gravestones}
      isEndgame={isEndgame}
    />
  );
};
