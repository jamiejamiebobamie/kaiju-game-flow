import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useHover } from "../../Utils/utils";

const ICON_LOOKUP = {
  glass: {
    passive: "fa-crosshairs",
    active: "fa-tencent-weibo"
  },
  fire: {
    passive: "fa-free-code-camp",
    active: "fa-hand-lizard-o"
  },
  wood: {
    passive: "fa-leaf",
    active: "fa-tree"
  },
  lightning: {
    passive: "fa-bug",
    active: "fa-bolt"
  },
  death: {
    passive: "fa-heartbeat",
    active: "fa-snapchat-ghost"
  },
  bubble: {
    passive: "fa-universal-access",
    active: "fa-question-circle-o"
  },
  metal: {
    passive: "fa-cutlery",
    active: "fa-shield"
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
  cursor: pointer;
  ${props =>
    props.isCoolDown && "animation: spin linear " + props.cooldownTime + "ms;"}
  @keyframes spin {
    0% {
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
  cooldownTime = 9000,
  // chargeUpTime = 3000,
  activatePassive = () => console.log("Passive activated!"),
  activateActive = () => console.log("Active activated!")
}) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const [isPassive, setIsPassive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconLookupString, setIconLookupString] = useState("passive");
  useEffect(() => {
    if (isPassive) activatePassive();
  }, [isPassive]);
  useEffect(() => {
    if (isActive) activateActive();
  }, [isActive]);
  useEffect(() => {
    isAnimating && setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);
  return (
    <Wrapper
      onClick={() => {
        if (!isPassive) {
          setIsPassive(true);
          setIsAnimating(true);
          setTimeout(() => setIconLookupString("active"), 250);
        } else if (isPassive && !isActive) {
          setIsActive(true);
          setIsAnimating(true);
          setTimeout(() => setIconLookupString("passive"), 250);
          setTimeout(() => {
            setIsPassive(false);
            setIsActive(false);
            console.log("Cooldown is over!");
          }, cooldownTime);
        }
      }}
      isAnimating={isAnimating}
      ref={setHoverRef(abilityData.displayLookup)}
      title="test"
      alt="test desc"
    >
      <AbilityIcon
        disabled={true}
        className={`fa ${
          isPassive && isActive
            ? "fa-spinner"
            : ICON_LOOKUP[abilityData.element][iconLookupString]
        }`}
        isCoolDown={isPassive && isActive}
        cooldownTime={cooldownTime}
      />
    </Wrapper>
  );
};
