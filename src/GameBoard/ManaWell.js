import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { moveTo, useInterval, getRandomAdjacentLocation } from "../Utils/utils";

const Ripple = styled.div`
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.charLocation.x}px`};
  top: ${props => `${props.charLocation.y}px`};
  width: 10px;
  height: 10px;
  background-color: lightblue;
  border-radius: 100%;
  border-color:transparent;
  border-style:solid;
  animation: lds-ripple 3s linear infinite;
}
@keyframes lds-ripple {
  0% {
    width: 10;
    height: 10;
    opacity: 1;
  }
  50% {
      background-color: transparent;
      border-color:lightblue;
      margin-left:-2px;
      margin-top:-2px;


    width: 13px;
    height: 13px;
    opacity: .3;
  }
  100% {
    width: 10;
    height: 10;
    opacity: 1;
  }
`;

export const ManaWell = ({
  scale,
  charLocation,
  tileIndices,
  canvasLocation,
  element,
  owner
}) => {
  const [location, setLocation] = useState({
    x: charLocation.x,
    y: charLocation.y
  });
  const [moveToLocation, setMoveToLocation] = useState(
    getRandomAdjacentLocation({ x: charLocation.x, y: charLocation.y }, scale)
  );
  const [moveFromLocation, setMoveFromLocation] = useState({
    x: charLocation.x,
    y: charLocation.y
  });
  const [isThere, setIsThere] = useState(false);
  useInterval(() => {
    if (location && moveFromLocation && moveToLocation && !isThere)
      moveTo({
        currentLocation: location,
        moveFromLocation,
        moveToLocation,
        moveSpeed: 3,
        setLocation,
        setHasArrived: setIsThere
      });
  }, 500);
  useEffect(() => {
    if (isThere) {
      const newLocation = getRandomAdjacentLocation(moveToLocation, scale);
      setMoveToLocation({ x: newLocation.x, y: newLocation.y });
      setMoveFromLocation({ x: moveToLocation.x, y: moveToLocation.y });
      setIsThere(false);
    }
  }, [isThere]);
  return element ? (
    "TBD"
  ) : (
    <Ripple charLocation={location}>
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </Ripple>
  );
};
