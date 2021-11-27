import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { moveTo, getRandomIntInRange, useInterval } from "./Utils/utils";
import { Kaiju } from "./Utils/gameState";

const Character = styled.div`
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.x}px`};
  top: ${props => `${props.y}px`};
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  border-radius: 30px;
`;
export const Player = ({
  startingX = 0,
  startingY = 0,
  color = "blue",
  moveSpeed = 15
}) => {
  const [kaiju, setKaiju] = useState([]);
  const [accessory, setAccessory] = useState({});
  const [location, setLocation] = useState({ x: startingX, y: startingY });
  const [moveToLocation, setMoveToLocation] = useState({
    x: startingX + 300,
    y: startingY + 300
  });
  const [moveFromLocation, setMoveFromLocation] = useState({
    x: startingX,
    y: startingY
  });
  const [isThere, setIsThere] = useState(false);
  useInterval(
    () =>
      moveTo({
        curr_location: location,
        moveFromLocation,
        moveToLocation,
        moveSpeed,
        setLocation,
        setHasArrived: setIsThere
      }),
    500
  );
  useEffect(() => {
    const randInt = getRandomIntInRange({ max: Kaiju.length - 1 });
    const startingKaiju = { name: Kaiju[randInt], i: randInt, lvl: 1 };
    console.log(startingKaiju);
    setAccessory({});
    setKaiju([startingKaiju]);
  }, []);
  useEffect(() => {
    if (isThere) {
      setMoveToLocation({ x: moveFromLocation.x, y: moveFromLocation.y });
      setMoveFromLocation({ x: moveToLocation.x, y: moveToLocation.y });
      setIsThere(false);
    }
  }, [isThere]);
  return <Character x={location.x} y={location.y} color={color} />;
};
