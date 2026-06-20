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
const PopInEffect = styled.div`
  ${props =>
    `transform: translate(${props.isVisible ? 0 : 285 * props.scale}px, ${props.isVisible ? 0 : 285 * props.scale}px) scale(${props.isVisible ? 1 : 0});`};
  zindex: ${props => props.zIndex};
  ${props => !props.isTutorial && "pointer-events: none;"}
  ${props => !props.isVisible ? 'filter: drop-shadow(0 0 2px #80EF80);' : ''}
  transition: transform;
  transition-duration: 2s;
`;

export const GameBoardTileComponent = ({
  isVisible,
  tileLocation,
  scale = 1,
  i = 0,
  j = 0,
  setClickedIndex = () => { },
  isHighlighted0,
  status = {
    isOnKaijuFire: false,
    isOnFire: false,
    isWooded: false,
    isWet: false,
    isElectrified: false,
    isBubble: false,
    isShielded: false,
    isGhosted: false,
    isGraveyard: false
  },
  color,
  iconRotation,
  icon,
  zIndex,
  pieceTileColor
}) => {
  return (
    <Hexagon
      zIndex={zIndex}
      scale={scale}
      x={tileLocation.x}
      y={tileLocation.y}
    >
      <PopInEffect
        isVisible={isVisible}
        scale={scale}>
        <Content
          onClick={() => setClickedIndex({ i, j, x: tileLocation.x, y: tileLocation.y })}
          index={{ i, j }}
          isHighlighted0={isHighlighted0}
          status={status}
          color={pieceTileColor || color}
          isVisible={isVisible}
        />
        <Icon zIndex={zIndex} className={`fa ${icon}`} color={color} rotation={iconRotation} />
        <Border color={color} />
      </PopInEffect>
    </Hexagon>
  );
};
