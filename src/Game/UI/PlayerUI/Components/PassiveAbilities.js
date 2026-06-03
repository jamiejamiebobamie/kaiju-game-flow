import React from "react";
import styled from "styled-components";
import { PassiveAbility } from './PassiveAbility';

const Wrapper = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  position: absolute;
  top: 86px;
  right: 85px;
  width: 50px;
  height: 50px;
  transform: rotate(90deg);
  margin-top: -20px;
`;

export const PassiveAbilities = ({
  accTime,
  isTeammate,
  abilities = []
}) => {

  const passiveAbilityIcons = abilities.map((a, i) => {
    const cooldownTime = a.passiveDurationTime ? a.passiveDurationTime : isTeammate ? a.cooldownTimeAI : a.cooldownTime;
    const isOnCooldown = (a.accTime + cooldownTime) > accTime;
    return (
      <PassiveAbility
        key={i}
        i={i}
        element={a.element}
        passiveName={a.passiveName}
        color={a.color}
        isOnCooldown={!!a.accTime && isOnCooldown} // ensure power has been cast once (a.accTime != 0) to highlight passive 
        isTeammate={isTeammate}
        accTime={a.accTime}
      />
    )
  });
  return <Wrapper>{passiveAbilityIcons}</Wrapper>;
};
