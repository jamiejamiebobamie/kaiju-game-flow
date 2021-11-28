import React, { useState } from "react";
import styled from "styled-components";
import { Content } from "./Content";
import { Border } from "./Border";
import { getTileXAndY } from "../Utils/utils";

const Hexagon = styled.div`
  ${props =>
    `transform: translate(${props.x}px, ${props.y}px) scale(${props.scale});`};
  zindex: ${props => props.zIndex};
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
  const { x, y } = getTileXAndY({ i, j, scale });
  const zIndex = rowLength * i + j + 1;
  return (
    <Hexagon
      zIndex={zIndex}
      rowLength={rowLength}
      scale={scale}
      x={x}
      y={y}
      i={i}
      j={j}
    >
      <Content
        onClick={() => {
          setClickedIndex({ i, j, x, y });
        }}
        isHighlighted={isHighlighted}
        url=""
      />
      <Border />
    </Hexagon>
  );
};
