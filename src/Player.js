import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  moveTo,
  getRandomIntInRange,
  useInterval,
  isAdjacent,
  getTileIAndJFromCharXAndY,
  getCharXAndY,
  getRandomAdjacentLocation
} from "./Utils/utils";
import {
  STARTING_KAIJU_CHOICES,
  ACCESSORIES,
  PENINSULA_TILE_LOOKUP
} from "./Utils/gameState";

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
  chosenAccessory = ACCESSORIES,
  scale = 0.3
}) => {
  const [stats, setStats] = useState({
    dmg: 5,
    lives: 0,
    moveSpeed: 3
  });
  const [kaiju, setKaiju] = useState([]);
  const [accessory, setAccessory] = useState({});
  const [location, setLocation] = useState({ x: startingX, y: startingY });
  const [moveToLocation, setMoveToLocation] = useState(
    getRandomAdjacentLocation({ x: startingX, y: startingY }, scale)
  );
  const [moveFromLocation, setMoveFromLocation] = useState({
    x: startingX,
    y: startingY
  });
  const [isThere, setIsThere] = useState(false);
  const [init, setInit] = useState(false);
  useInterval(() => {
    if (location && moveFromLocation && moveToLocation && !isThere)
      moveTo({
        currentLocation: location,
        moveFromLocation,
        moveToLocation,
        moveSpeed: stats.moveSpeed,
        setLocation,
        setHasArrived: setIsThere
      });
  }, 500);
  useEffect(() => {
    const randInt1 = getRandomIntInRange({
      max: STARTING_KAIJU_CHOICES.length - 1
    });
    const startingKaiju = STARTING_KAIJU_CHOICES[randInt1];
    setKaiju([startingKaiju]);
    // TESTING
    const accessoryKeys = Object.keys(ACCESSORIES);
    const randInt2 = getRandomIntInRange({
      max: accessoryKeys.length - 1
    });
    const randKey = accessoryKeys[randInt2];
    const randAccessory = ACCESSORIES[randKey];
    const { Compass } = ACCESSORIES;
    setAccessory({ Compass, [randAccessory.key]: randAccessory });
    randAccessory && randAccessory.effect({ Kaiju: kaiju, setStats, setKaiju });
    // NORMAL CODE -- Player will choose their accessory.
    // chosenAccessory
    //   ? setAccessory({ Compass, [chosenAccessory.key]: chosenAccessory })
    //   : setAccessory({ Compass });
    // chosenAccessory && chosenAccessory.effect({ Kaiju: kaiju, setStats });
  }, []);
  useEffect(() => {
    if (isThere) {
      const newLocation = getRandomAdjacentLocation(moveToLocation, scale);
      setMoveToLocation({ x: newLocation.x, y: newLocation.y });
      setMoveFromLocation({ x: moveToLocation.x, y: moveToLocation.y });
      setIsThere(false);
    }
  }, [isThere]);
  return <Character x={location.x} y={location.y} color={color} />;
};
