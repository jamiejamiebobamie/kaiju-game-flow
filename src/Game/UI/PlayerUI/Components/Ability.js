import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHover, useKeyPress } from "../../../../Utils/utils";

const ICON_LOOKUP = {
  heart: {
    passive: "fa-gratipay",
    active: "fa-heart",
    loader: "fa-spinner"
  },
  glass: {
    passive: "fa-tencent-weibo",
    active: "fa-ravelry",
    loader: "fa-spinner"
  },
  fire: {
    passive: "fa-fire",
    active: "fa-free-code-camp",
    loader: "fa-spinner"
  },
  wood: {
    passive: "fa-tree",
    active: "fa-leaf",
    loader: "fa-spinner"
  },
  lightning: {
    passive: "fa-hourglass-half",
    active: "fa-bolt",
    loader: "fa-spinner"
  },
  death: {
    passive: "fa-heartbeat",
    active: "fa-snapchat-ghost",
    loader: "fa-spinner"
  },
  bubble: {
    passive: "fa-universal-access",
    active: "fa-question-circle-o",
    loader: "fa-spinner"
  },
  metal: {
    passive: "fa-cutlery",
    active: "fa-shield",
    loader: "fa-spinner"
  },
  ice: {
    passive: "fa-thermometer-quarter",
    active: "fa-snowflake-o",
    loader: "fa-spinner"
  },
  kaijuFire: {
    passive: "fa-free-code-camp",
    active: "fa-free-code-camp",
    loader: "fa-spinner"
  }
};
const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
  margin-left: 10px;
  justify-self: center;
  align-self: center;
  border-radius: 100%;
  border-style: solid;
  border-color: ${props => props.color};
  min-width: 50px;
  height: 50px;
  ${props => props.isAnimating && "animation: rotation linear .5s;"};
  cursor: pointer;
  @keyframes rotation {
    0% {
      transform: rotate3d(0, 1, 0, 0deg);
    }
    50% {
      transform: rotate3d(0, 1, 0, 90deg);
    }
    100% {
      transform: rotate3d(0, 1, 0, 0deg);
    }
  }
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-name: fadeInRightAbility;
  animation-name: fadeInRightAbility;
  @keyframes fadeInRightAbility {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    10% {
      opacity: 0;
      transform: translateX(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
const AbilityIcon = styled.i`
  color: ${props => props.color};
  z-index: ${props => props.i};
  justify-self: center;
  align-self: center;
  transform: scale(2);
  ${props =>
    props.isCoolDown && "animation: spin linear " + props.cooldownTime + "ms;"}
  @keyframes spin {
    5% {
      transform: scale(2) rotate(0deg);
    }
    80% {
      transform: scale(2) rotate(648deg);
      opacity: 1;
    }
    100% {
      transform: scale(4) rotate(900deg);
      opacity: 0;
    }
  }
`;
const AbilityNum = styled.div`
  display: flex;
  position: absolute;
  right: -10px;
  bottom: -3px;
  z-index: 2;
  width: 18px;
  height: 18px;
  border-radius: 10px;
  border-radius: 100%;
  border-style: solid;
  border-thickness: thin;
  border-color: ${props => props.color};
  background-color: ${props => props.color};
  color: #152642;
  text-align: right;
  align-content: center;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;
export const Ability = ({
  playerIndex,
  abilityData,
  playerData,
  kaijuData,
  setPlayerData,
  setTeleportData,
  setTileStatuses,
  scale,
  setDisplayString,
  keyNum
}) => {
  const {
    activeName,
    activateActive,
    cooldownTime,
    displayLookup,
    element,
    accTime,
    color
  } = abilityData;
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconLookupString, setIconLookupString] = useState("active");
  useKeyPress(() => playerIndex === 0 && handleClick(), `Digit${keyNum}`);
  useEffect(() => {
    if (isActive) {
      playerIndex === 0 &&
        activateActive(
          playerIndex,
          playerData,
          setTeleportData,
          kaijuData,
          setTileStatuses,
          scale
        );
      setIsAnimating(true);
      setTimeout(() => setIconLookupString("loader"), 250);
      setTimeout(() => {
        setIsActive(false);
        setIconLookupString("active");
      }, cooldownTime);
    }
  }, [isActive]);
  useEffect(() => playerIndex === 1 && setIsActive(true), [accTime]);
  useEffect(() => {
    isAnimating && setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);
  const handleClick = () => !isActive && setIsActive(true);
  return (
    <Wrapper
      onClick={() => {
        playerIndex === 0 && handleClick();
      }}
      isAnimating={isAnimating}
      ref={setHoverRef(`${displayLookup}Active`)}
      title={activeName}
      color={color}
    >
      <AbilityIcon
        disabled={true}
        className={`fa ${ICON_LOOKUP[element][iconLookupString]}`}
        isCoolDown={isActive}
        cooldownTime={cooldownTime}
        color={color}
      />
      <AbilityNum color={color}>
        <div style={{ marginLeft: "4px" }}>{keyNum}</div>
      </AbilityNum>
    </Wrapper>
  );
};
