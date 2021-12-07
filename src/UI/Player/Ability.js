import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useHover } from "../../Utils/utils";

const Wrapper = styled.div`
  display: flex;
  ${props =>
    props.isReversed ? "flex-flow: row wrap;" : "flex-flow: row wrap-reverse;"}
  justify-content: flex-start;
  width: 65%;
  height: 100%;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  overflow: scroll;
  overflow-y: scroll;
`;
const AbilityIcon = styled.img`
  margin-left: 10px;
  justify-self: center;
  align-self: center;
  border-radius: 100%;
  border-style: solid;
  min-width: 50px;
  height: 50px;
`;
export const Ability = ({
  abilityData,
  setDisplayString,
  cooldownTime = 3,
  chargeUpTime = 3,
  activatePassive = () => console.log("Passive activated!"),
  activateActive = () => console.log("Active activated!")
}) => {
  const [hoverRef, setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const [isPassive, setIsPassive] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [cooldownCalled, setCooldownCalled] = useState(false);
  useEffect(() => {
    if (isPassive) activatePassive();
  }, [isPassive]);
  useEffect(() => {
    if (isActive) activateActive();
  }, [isActive]);
  return (
    <AbilityIcon
      onClick={() => {
        if (!isPassive) {
          setTimeout(() => setIsPassive(true), chargeUpTime);
        } else if (isPassive && !isActive) {
          setIsActive(true);
        } else if (isPassive && isActive && !cooldownCalled) {
          setCooldownCalled(true);
          setTimeout(() => {
            setIsPassive(false);
            setIsActive(false);
            setCooldownCalled(false);
            console.log("Cooldown is over!");
          }, cooldownTime);
        }
      }}
      ref={setHoverRef(abilityData.displayLookup)}
      src={"fire_icon.png"}
      title="test"
      alt="test desc"
    />
  );
};
