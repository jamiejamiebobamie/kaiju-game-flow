import React, { useState, useEffect } from "react";
import styled from "styled-components";

const GraveYardDot = styled.div`
  position: absolute;
  z-index: 10001;
  left: ${props => `${props.x}px`};
  top: ${props => `${props.y}px`};
  width: 10px;
  height: 10px;
  background-color: "lightgrey";
  border-radius: 30px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-style: solid;
  border-width: medium;
  border-color: "lightgrey";
  pointer-events: none;
`;
export const Graveyard = ({ charLocation, tileIndices, isUnused }) => {
  return isUnused && <GraveYardDot x={charLocation.x} y={charLocation.y} />;
};
