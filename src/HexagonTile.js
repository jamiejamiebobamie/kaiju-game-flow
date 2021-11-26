import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Content } from "./Content";
import { Border } from "./Border";

const Hexagon = styled.div`
  ${props =>
    `transform: translate(${(props.i === 0
      ? props.i * 45 - 25
      : props.i % 2
      ? props.i * 45 + 25 * (props.i - 1)
      : props.i * 45 + 25 * (props.i - 1)) * props.scale}px, ${(props.i % 2
      ? props.j * 80 + 40
      : props.j * 80) * props.scale}px) scale(${props.scale});`};
  z-index: ${props => props.rowLength * props.i + props.j};
`;
export const HexagonTile = ({ rowLength = 1, scale = 1, i = 0, j = 0 }) => {
  const [state, setState] = useState({
    isHighlighted: false,
    url: null
  });
  return (
    <Hexagon rowLength={rowLength} scale={scale} i={i} j={j}>
      <Content isHighlighted={state.isHighlighted} url="" />
      <Border />
    </Hexagon>
  );
};
