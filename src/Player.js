import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Character = styled.div`
  position: absolute;
  z-index: 1001;
  left: ${props => `${props.x}px`};
  top: ${props => `${props.y}px`};
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  border-radius: 30px;
`;
export const Player = ({ startingX = 0, startingY = 0, color = "blue" }) => {
  const [location, setLocation] = useState({ x: startingX, y: startingY });
  const [moveToLocation, setMoveToLocation] = useState({
    x: startingX + 100,
    y: startingY + 100
  });
  const [isThere, setIsThere] = useState(false);
  useEffect(() => {
    // setInterval(moveTo, 5000);
  }, []);
  useEffect(() => {
    if (isThere) {
      setMoveToLocation({ x: startingX, y: startingY });
      setIsThere(false);
    }
  }, [isThere]);
  const moveTo = () => {
    const x_to = moveToLocation.x;
    const y_to = moveToLocation.y;
    const { x, y } = location;
    const distance = Math.sqrt(Math.exp(x_to - x, 2) + Math.exp(y_to - y, 2));
    if (distance < 10) setIsThere(true);
    const x_dir = Math.sqrt(Math.exp(x_to - x, 2));
    const y_dir = Math.sqrt(Math.exp(y_to - y, 2));
    setLocation({ x: x + x_dir, y: y + y_dir });
  };
  return <Character x={location.x} y={location.y} color={color} />;
};
