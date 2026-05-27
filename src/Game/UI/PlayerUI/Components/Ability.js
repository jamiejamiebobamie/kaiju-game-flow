import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useKeyPress } from "../../../../Utils/utils";

const COOLDOWN_VALS = Object.freeze({
  false: false,
  true: true,
  click: 1
});

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
  transition: 2s;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  /* -webkit-animation-name: fadeInRightAbility;
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
  } */
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
  pointer-events: auto;

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
  abilityIndex,
  playerIndex,
  abilityData,
  playerData,
  setPlayerData,
  kaijuData,
  setTeleportData,
  setTileStatuses,
  scale,
  keyNum,
  isPaused,
  accTime
}) => {
  const {
    activeName,
    activateActive,
    togglePassive,
    cooldownTime,
    cooldownTimeAI,
    element,
    color
  } = abilityData;
  const abilityAccTime = abilityData.accTime;
  const [isOnCoolDown, setIsOnCoolDown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconLookupString, setIconLookupString] = useState("active");

  // disable ability buttons if game is paused or character is dead
  const isPlayerAlive = typeof playerIndex == 'number' && Array.isArray(playerData) && playerData.length > playerIndex && !!playerData[playerIndex] && !playerData[playerIndex].isDead;
  const handleClick = () => !isOnCoolDown && isPlayerAlive && !isPaused && setIsOnCoolDown(COOLDOWN_VALS.click); // true, false, 1=player click
  useKeyPress({
    keyCodes: `Digit${keyNum}`,
    keyDownCallback: handleClick,
    isPlayerDead: isPaused || !isPlayerAlive
  });
  useEffect(() => {
    if (isOnCoolDown && isPlayerAlive && !isPaused) {

      if (COOLDOWN_VALS.click === isOnCoolDown) {
        // activate player active ability
        activateActive(
          playerIndex,
          playerData,
          setTeleportData,
          kaijuData,
          setTileStatuses,
          scale,
          { current: { [element]: { shotPower: false } } }
        );

        // toggle-on player passive ability
        if (togglePassive != undefined && setPlayerData != undefined) {
          setPlayerData(p => {
            if (!!p[playerIndex]) {
              const update = togglePassive(p[playerIndex]);
              // console.log("before toggle-on passive", { player: p[playerIndex], update, element });
              p[playerIndex] = update;
              p[playerIndex].abilities[abilityIndex].accTime = accTime;
              // console.log("after toggle-on passive", { player: p[playerIndex], update, element });
            }
            return p;
          })
        }
      }


      setIsAnimating(true);
      setTimeout(() => setIconLookupString("loader"), 250);

      // console.log("before timeout", cooldownTime, element);
      setTimeout(() => {
        setIsOnCoolDown(COOLDOWN_VALS.false);
        setIconLookupString("active");
        // console.log("timeout triggered", cooldownTime, element);

        if (COOLDOWN_VALS.click === isOnCoolDown && togglePassive != undefined && setPlayerData != undefined) {
          // toggle-off player passive ability
          setPlayerData(p => {
            if (!!p[playerIndex]) {
              const toggleOff = true;
              const update = togglePassive(p[playerIndex], toggleOff);
              // console.log("before toggle-off passive", { player: p[playerIndex], update, element, cooldownTime });
              p[playerIndex] = update;
              // console.log("after toggle-off passive", { player: p[playerIndex], update, element, cooldownTime });
            }
            return p;
          });
        }
      }, playerIndex > 0 ? cooldownTimeAI : cooldownTime);
    }
  }, [isOnCoolDown]);

  // handle teammate ability button aesthetics:
  useEffect(() => playerIndex === 1 && setIsOnCoolDown(COOLDOWN_VALS.true), [abilityAccTime]);

  useEffect(() => {
    isAnimating && setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);
  return (
    <Wrapper
      onClick={() => isPlayerAlive && !isPaused && handleClick()}
      isAnimating={isAnimating}
      title={activeName}
      color={color}
    >
      <AbilityIcon
        disabled={true}
        className={`fa ${ICON_LOOKUP[element][iconLookupString]}`}
        isCoolDown={isOnCoolDown}
        cooldownTime={playerIndex > 0 ? cooldownTimeAI : cooldownTime}
        color={color}
      />
      <AbilityNum color={color}>
        <div style={{ marginLeft: "4px" }}>{keyNum}</div>
      </AbilityNum>
    </Wrapper>
  );
};
