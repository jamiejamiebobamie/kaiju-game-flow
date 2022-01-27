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
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : "17px")};
  ${Math.random() > 0.5
    ? `margin-left: ${Math.random() * 10}px`
    : `margin-right: ${Math.random() * 10}px`};
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
  const [modifierText, setModifierText] = useState([]);
  const [isDamaged, setIsDamaged] = useState(null);
  const [isHealedLocal, setIsHealedLocal] = useState(false);
  const [isTeleportedLocal, setIsTeleportedLocal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      if (!isHealedLocal) {
        console.log("!isHealed");
        setIsDamaged(true);
        setModifierText(prevText => [
          ...prevText,
          <ModiferText color={"red"}>{"-1"}</ModiferText>
        ]);
        setTimeout(() => setIsDamaged(null), 2000);
      }
    }
  }, [lives]);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      if (!isHealedLocal) {
        setIsHealedLocal(true);
        setTimeout(() => setIsHealedLocal(false), 2000);
        setModifierText(prevText => [
          ...prevText,
          <ModiferText color={"green"}>{"+1"}</ModiferText>
        ]);
      }
    }
  }, [isHealed]);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      if (!isTeleportedLocal) {
        setIsTeleportedLocal(true);
        setTimeout(() => setIsTeleportedLocal(false), 2000);
        setModifierText(prevText => [
          ...prevText,
          <ModiferText fontSize={13} color={"purple"}>
            Zip!
          </ModiferText>
        ]);
      }
    }
  }, [isTeleported]);
  return (
    <Wrapper lives={lives} charLocation={charLocation}>
      {modifierText}
      <Character
        isDamaged={isDamaged}
        color={color}
        src={color === "blue" ? "player.png" : "teammate.png"}
      />
    </Wrapper>
  );
};
