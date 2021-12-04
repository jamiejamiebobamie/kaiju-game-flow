import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  moveTo,
  getRandomIntInRange,
  useInterval,
  isAdjacent,
  getTileIAndJFromCharXAndY,
  getCharXAndY,
  getRandomAdjacentLocation,
  isLocatonInsidePolygon,
  getIAndJFromManaWellXAndY
} from "../Utils/utils";
import {
  STARTING_KAIJU_CHOICES,
  ACCESSORIES,
  PENINSULA_TILE_LOOKUP
} from "../Utils/gameState";

const Character = styled.div`
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.charLocation.x}px`};
  top: ${props => `${props.charLocation.y}px`};
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  border-radius: 30px;
  font-size: 10px;
  ${props => props.isInManaPool && "animation: blinkingText 5s infinite;"}
}
@keyframes blinkingText{
  0%		{ background-color: #10c018;}
  25%		{ background-color: #1056c0;}
  50%		{ background-color: #ef0a1a;}
  75%		{ background-color: #254878;}
  100%	{ background-color: #04a1d5;}
}
`;
export const Player = ({ charLocation, isInManaPool, color, i = 0 }) => {
  useEffect(() => console.log(isInManaPool, i), [isInManaPool]);
  return (
    <Character
      charLocation={charLocation}
      color={color}
      isInManaPool={isInManaPool}
    >
      <div
        style={{
          marginLeft: "2px",
          marginTop: "-2px"
        }}
      >
        {i}
      </div>
    </Character>
  );
};
