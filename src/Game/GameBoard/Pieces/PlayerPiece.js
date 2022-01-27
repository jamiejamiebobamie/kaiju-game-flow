import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash";

const Wrapper = styled.i`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.charLocation.x + 3.5}px`};
  top: ${props => `${props.charLocation.y}px`};
  color: ${props => props.color};
  pointer-events: none;
`;
const Character = styled.img`
    margin-left: -20px;
    margin-top: -45px;
    width: 50px;
    height: 75px;
    position: absolute;
    z-index: 1;
  pointer-events: none;
  animation-iteration-count: 2s;
  ${props => props.isDamaged && "animation: shake 0.5s;"};
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
}
`;
const ModiferText = styled.p`
  position: absolute;
  margin-top: -30px;
  z-index: 20002;
  opacity: 0;
  ${props =>
    Math.random() > 0.5
      ? `margin-left: ${props.randShift}px`
      : `margin-right: ${props.randShift}px`};
  color: ${props => props.color};
  animation-timing-function: ease-in;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-name: textRise;
  animation-name: textRise;
  @keyframes textRise {
    0% {
      opacity: 0;
      transform: translateY(0px);
    }
    10% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;

export const Player = ({
  dir,
  lives,
  charLocation,
  isInManaPool,
  isHealed,
  isTeleported,
  color,
  i = 0
}) => {
  const [healthModifierText, setHealthModifierText] = useState([]);
  const [isDamaged, setIsDamaged] = useState(null);
  useEffect(() => {
    if (!isHealed && isDamaged === false) {
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 2000);
    } else if (isDamaged === null) setIsDamaged(false);
    setHealthModifierText(prevText => [
      ...prevText,
      <ModiferText
        randShift={Math.random() * 10}
        color={isHealed ? "green" : "red"}
      >
        {isHealed ? "+1" : "-1"}
      </ModiferText>
    ]);
  }, [isHealed, lives]);

  // <p>{dir}</p>

  return (
    <Wrapper lives={lives} charLocation={charLocation}>
      {healthModifierText}
      <Character
        isDamaged={isDamaged}
        color={color}
        src={color === "blue" ? "player.png" : "teammate.png"}
      />
    </Wrapper>
  );
};
