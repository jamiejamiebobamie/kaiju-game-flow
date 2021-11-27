import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { moveTo, getRandomIntInRange, useInterval } from "./Utils/utils";
import { STARTING_KAIJU_CHOICES, ACCESSORIES } from "./Utils/gameState";

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
  chosenAccessory = ACCESSORIES
}) => {
  const [stats, setStats] = useState({
    dmg: 5,
    lives: 0,
    moveSpeed: 15
  });
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
        currentLocation: location,
        moveFromLocation,
        moveToLocation,
        moveSpeed: stats.moveSpeed,
        setLocation,
        setHasArrived: setIsThere
      }),
    500
  );
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
    setTimeout(
      () =>
        console.log({
          color,
          startingKaiju,
          randAccessory,
          kaiju,
          accessory
        }),
      1000
    );
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
