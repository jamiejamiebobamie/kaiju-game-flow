import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHover, useKeyPress } from "../../Utils/utils";

const ICON_LOOKUP = {
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
  wind: {
    passive: "fa-feed",
    active: "fa-cloud",
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
`;
const AbilityIcon = styled.i`
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
  border-color: black;
  background-color: #f2e3cc;
  color: black;
  text-align: center;
  align-content: center;
  align-items: center;
  justify-content: center;
  font-family: gameboy;
  font-size: 12px;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const Ability = ({
  playerIndex,
  abilityData,
  setPlayerData,
  setTileStatuses,
  scale,
  setDisplayString,
  keyNum,
  ghosts
}) => {
  const {
    passiveName,
    activeName,
    // activatePassive,
    activateActive,
    cooldownTime,
    displayLookup,
    element
  } = abilityData;
  const [setHoverRef, hoverLookupString] = useHover();
  // useEffect(() => {
  //   activatePassive && activatePassive();
  // }, []);
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const [isPassive, setIsPassive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconLookupString, setIconLookupString] = useState("active");
  useKeyPress(
    () => handleClick(),

    // {
    // console.log(getPlayerIndex, keyNum);
    // if (getPlayerIndex && getPlayerIndex() === 0) {
    //   console.log(keyNum);
    // }
    // }
    `Digit${keyNum}`
  );
  useEffect(() => {
    if (isActive) {
      activateActive(playerIndex, setPlayerData, setTileStatuses, scale);
      setIsAnimating(true);
      setTimeout(() => setIconLookupString("loader"), 250);
      setTimeout(() => {
        setIsActive(false);
        setIconLookupString("active");
      }, cooldownTime);
    }
  }, [isActive]);
  useEffect(() => {
    isAnimating && setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);
  const handleClick = () => !isActive && setIsActive(true);
  return (
    <Wrapper
      onClick={handleClick}
      isAnimating={isAnimating}
      ref={setHoverRef(`${displayLookup}Active`)}
      title={activeName}
      alt="test desc"
    >
      <AbilityIcon
        disabled={true}
        className={`fa ${ICON_LOOKUP[element][iconLookupString]}`}
        isCoolDown={isActive}
        cooldownTime={cooldownTime}
      />
      <AbilityNum>{keyNum}</AbilityNum>
    </Wrapper>
  );
};
