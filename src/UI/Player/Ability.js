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
    passive: "fa-free-code-camp",
    active: "fa-hand-lizard-o",
    loader: "fa-spinner"
  },
  wood: {
    passive: "fa-leaf",
    active: "fa-tree",
    loader: "fa-spinner"
  },
  lightning: {
    passive: "fa-bug",
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
  }
};

const Wrapper = styled.div`
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
export const Ability = ({
  abilityData,
  setDisplayString,
  keyNum
  // cooldownTime = 9000
  // chargeUpTime = 3000,
  // activatePassive = () => console.log("Passive activated!"),
  // activateActive = () => console.log("Active activated!")
}) => {
  const {
    passiveName,
    activeName,
    activatePassive,
    activateActive,
    cooldownTime,
    displayLookup,
    element,
    getPlayerIndex
  } = abilityData;
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const [isPassive, setIsPassive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconLookupString, setIconLookupString] = useState("passive");
  useKeyPress(() => {
    if (getPlayerIndex && getPlayerIndex() === 0) setIsActive(curr => !curr);
  }, `Digit${keyNum}`);
  useEffect(() => {
    if (isPassive) activatePassive();
  }, [isPassive]);
  useEffect(() => {
    if (isActive) activateActive();
  }, [isActive]);
  useEffect(() => {
    isAnimating && setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);
  const handleClick = () => {
    if (!isPassive) {
      setIsPassive(true);
      setIsAnimating(true);
      setTimeout(() => setIconLookupString("active"), 250);
    } else if (isPassive && !isActive) {
      setIsActive(true);
      setIsAnimating(true);
      setTimeout(() => setIconLookupString("loader"), 250);
      setTimeout(() => {
        setIsPassive(false);
        setIsActive(false);
        setIconLookupString("passive");
        console.log("Cooldown is over!");
      }, cooldownTime);
    }
  };
  return (
    <Wrapper
      onClick={handleClick}
      isAnimating={isAnimating}
      ref={setHoverRef(
        `${displayLookup}${
          iconLookupString === "passive" ? "Passive" : "Active"
        }`
      )}
      title={isPassive && !isActive ? activeName : passiveName}
      alt="test desc"
    >
      <AbilityIcon
        disabled={true}
        className={`fa ${ICON_LOOKUP[element][iconLookupString]}`}
        isCoolDown={isPassive && isActive}
        cooldownTime={cooldownTime}
      />
    </Wrapper>
  );
};
