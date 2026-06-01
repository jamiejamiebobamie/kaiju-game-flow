import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useKeyPress } from "Utils/utils";

const COOLDOWN_VALS = Object.freeze({
  false: false,
  true: true,
  click: 1
});

const ICON_LOOKUP = {
  love: {
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
  water: {
    passive: "fa-exclamation-triangle",
    active: "fa-tint",
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

const useHandlePlayerClickAbilityButtons = ({
  isOnCoolDown,
  isCharacterAlive,
  isPaused,
  element,
  togglePassive,
  abilityIndex,
  playerIndex,
  playerData,
  setPlayerData,
  kaijuData,
  setTeleportData,
  setTileStatuses,
  scale,
  accTime,
  activateActive,
  cooldownTime,
  cooldownTimeAI,
  passiveDurationTime,
  abilityData,
  isTriggerPassiveImmediately
}) => {
  useEffect(() => {
    if (isOnCoolDown && isCharacterAlive && !isPaused) activateAbilityFromPlayerClick({
      isOnCoolDown,
      element,
      togglePassive,
      abilityIndex,
      playerIndex,
      playerData,
      setPlayerData,
      kaijuData,
      setTeleportData,
      setTileStatuses,
      scale,
      accTime,
      activateActive,
      cooldownTime,
      cooldownTimeAI,
      passiveDurationTime,
      abilityData,
      isTriggerPassiveImmediately
    });
  }, [isOnCoolDown]);
};

const activateAbilityFromPlayerClick = ({
  isOnCoolDown,
  element,
  togglePassive,
  abilityIndex,
  playerIndex,
  playerData,
  setPlayerData,
  kaijuData,
  setTeleportData,
  setTileStatuses,
  scale,
  accTime,
  activateActive,
  cooldownTime,
  cooldownTimeAI,
  passiveDurationTime,
  isTriggerPassiveImmediately = true
}) => { // player triggered their abilities or teammate's abilities 
  if (COOLDOWN_VALS.click === isOnCoolDown) {

    // activate active ability
    activateActive(
      playerIndex,
      playerData,
      setTeleportData,
      kaijuData,
      setTileStatuses,
      scale
    );

    const triggerPassive = () => {
      if (togglePassive != undefined && setPlayerData != undefined) {
        const delay = passiveDurationTime ?
          passiveDurationTime : // required when the passive effect's duration needs to be shorter than the cooldown time
          (playerIndex > 0 ?
            cooldownTimeAI : cooldownTime);
        // set timer to toggle-off player passive ability once cooldown ends
        const timeoutRef = setTimeout(() => {
          setPlayerData(p => {
            if (!!p[playerIndex]) {
              const toggleOff = true;
              const update = togglePassive(p[playerIndex], toggleOff);
              p[playerIndex] = update;
            }
            return p;
          });
        }, delay);
        // activate passive ability
        setPlayerData(p => {
          if (!!p[playerIndex]) {
            const update = togglePassive(p[playerIndex]);
            p[playerIndex] = update;
            p[playerIndex].abilities[abilityIndex].accTime = accTime;
            p[playerIndex].abilities[abilityIndex].toggleOffPassiveTimeoutRef = timeoutRef;
          }
          return p;
        });
      }
    }

    if (isTriggerPassiveImmediately) {
      triggerPassive();
    } else {
      // store passive to trigger later
      setPlayerData(p => {
        if (!!p[playerIndex]) {
          // teleport passive is called after teleport
          p[playerIndex].storedPassive = triggerPassive;
        }
        return p;
      });
    }
  }
};

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
    passiveDurationTime,
    element,
    color
  } = abilityData;
  const abilityAccTime = abilityData.accTime;
  const [isOnCoolDown, setIsOnCoolDown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [iconLookupString, setIconLookupString] = useState("active");

  // disable ability buttons if game is paused or character is dead
  const isCharacterAlive = typeof playerIndex == 'number' && Array.isArray(playerData) && playerData.length > playerIndex && !!playerData[playerIndex] && !playerData[playerIndex].isDead;

  const handleClick = () => !isPaused && isCharacterAlive && setIsOnCoolDown(isOnCoolDown =>
    isOnCoolDown == true ? // check to see if already on cooldown...
      isOnCoolDown // if already on cooldown, do not change
      : COOLDOWN_VALS.click); // COOLDOWN_VALS.click = 1 ("player click")

  useKeyPress({
    keyCodes: `Digit${keyNum}`,
    keyDownCallback: handleClick, // closure. just sets state var 'setIsOnCoolDown' to COOLDOWN_VALS.click = 1 ("player click")
    isCharacterDead: isPaused || !isCharacterAlive
  });

  /*
    triggered by keyDownCallback closure: "handleClick"
    player triggered their abilities or teammate's abilities by clicking 
  */
  useHandlePlayerClickAbilityButtons({
    /* fresh data */
    isOnCoolDown,
    isCharacterAlive,
    isPaused,
    element,
    togglePassive,
    abilityIndex,
    playerIndex,
    playerData,
    setPlayerData,
    kaijuData,
    setTeleportData,
    setTileStatuses,
    scale,
    accTime,
    activateActive,
    cooldownTime,
    cooldownTimeAI,
    passiveDurationTime,
    abilityData,
    isTriggerPassiveImmediately: element != "glass"
  });

  /* teammate triggered ability with AI logic. handle ability button aesthetics. */
  useEffect(() => playerIndex === 1 && setIsOnCoolDown(COOLDOWN_VALS.true), [abilityAccTime]);

  /* ability button cooldown aesthetics for teammate and player. */
  useEffect(() => {
    if (isOnCoolDown && !isPaused) {
      // ability icon cooldown aesthetics
      setIsAnimating(true);
      setTimeout(() => setIconLookupString("loader"), 250);
      setTimeout(() => {
        setIsOnCoolDown(COOLDOWN_VALS.false);
        setIconLookupString("active");
      }, cooldownTime);
    }
  }, [isOnCoolDown]);

  useEffect(() => {
    isAnimating && setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);
  return (
    <Wrapper
      onClick={() => isCharacterAlive && !isPaused && handleClick()}
      isAnimating={isAnimating}
      title={activeName}
      color={color}
    >
      <AbilityIcon
        disabled={true}
        className={`fa ${ICON_LOOKUP[element][iconLookupString]}`}
        isCoolDown={isOnCoolDown}
        cooldownTime={cooldownTime}
        color={color}
      />
      <AbilityNum color={color}>
        <div style={{ marginLeft: "4px" }}>{keyNum}</div>
      </AbilityNum>
    </Wrapper>
  );
};
