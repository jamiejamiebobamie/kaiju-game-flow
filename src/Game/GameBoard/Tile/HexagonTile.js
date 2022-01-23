import React from "react";
import styled from "styled-components";
import { Content } from "./Parts/Content";
import { Border } from "./Parts/Border";
import { Icon } from "./Parts/Icon";

const Hexagon = styled.div`
  ${props =>
    `transform: translate(${props.x}px, ${props.y}px) scale(${props.scale});`};
  zindex: ${props => props.zIndex};
`;
export const HexagonTile = ({
  tileLocation,
  setHoverRef,
  rowLength = 1,
  scale = 1,
  i = 0,
  j = 0,
  setClickedIndex = () => {},
  isHighlighted0,
  status = {
    isOnKaijuFire: false,
    isOnFire: false,
    isWooded: false,
    isElectrified: false,
    isBubble: false,
    isShielded: false,
    isGhosted: false,
    isGraveyard: false
  }
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
        index={{ i, j }}
        setHoverRef={setHoverRef}
        isHighlighted0={isHighlighted0}
        status={status}
      />
      <Icon zIndex={zIndex} status={status} />
      <Border />
    </Hexagon>
  );
};
