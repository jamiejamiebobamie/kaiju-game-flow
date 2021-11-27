import React, { useState } from "react";
import styled from "styled-components";
import { Content } from "./Content";
import { Border } from "./Border";

const Hexagon = styled.div`
  ${props =>
    `transform: translate(${
      (props.i === 0
        ? props.i * 45 - 25
        : props.i % 2
        ? props.i * 45 + 25 * (props.i - 1)
        : props.i * 45 + 25 * (props.i - 1)) * props.scale

      // - 25 / props.scale // modifer to shift tiles to the left
    }px, ${
      (props.i % 2 ? props.j * 80 + 40 : props.j * 80) * props.scale
      // - 40 / props.scale // modifer to shift tiles to the up
    }px) scale(${props.scale});`};
  z-index: ${props => props.rowLength * props.i + props.j + 1};
`;
export const HexagonTile = ({
  rowLength = 1,
  scale = 1,
  i = 0,
  j = 0,
  setClickedIndex = () => {},
  isHighlighted = false
}) => {
  const [state, setState] = useState({
    url: null
  });
  return (
    <Hexagon rowLength={rowLength} scale={scale} i={i} j={j}>
      <Content
        onClick={() => setClickedIndex({ i, j })}
        isHighlighted={isHighlighted}
        url=""
      />
      <Border />
    </Hexagon>
  );
};
