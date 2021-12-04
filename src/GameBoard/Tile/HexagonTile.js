import React, { useState } from "react";
import styled from "styled-components";
import { Content } from "./Content";
import { Border } from "./Border";
import { getTileXAndY } from "../../Utils/utils";

const Hexagon = styled.div`
  ${props =>
    `transform: translate(${props.x}px, ${props.y}px) scale(${props.scale});`};
  zindex: ${props => props.zIndex};
`;
export const HexagonTile = ({
  tileLocation,
  rowLength = 1,
  scale = 1,
  i = 0,
  j = 0,
  setClickedIndex = () => {},
  isHighlighted,
  isOnFire,
  isWooded
}) => {
  const zIndex = rowLength * i + j + 1;
  return (
    <Hexagon
      zIndex={zIndex}
      scale={scale}
      x={tileLocation.x}
      y={tileLocation.y}
    >
      <Content
        onClick={() =>
          setClickedIndex({ i, j, x: tileLocation.x, y: tileLocation.y })
        }
        isHighlighted={isHighlighted}
        isWooded={!isOnFire && isWooded}
        isOnFire={isOnFire}
      />
      <Border />
    </Hexagon>
  );
};
