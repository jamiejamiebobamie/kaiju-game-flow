import React, { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  position: absolute;
  ${props => (props.isReversed ? "top: 86px;" : "top: 79px;")};
  ${props => (props.isReversed ? "right: 85px;" : "right: 77px;")};
  width: 50px;
  height: 50px;
  transform: rotate(${props => (props.isReversed ? 90 : 30)}deg);
  margin-top: -20px;
`;
const PassiveAbilityWrapper = styled.div`
  position: absolute;
  right: 20px;
  width: 100px;
  height: 0px;
  transform: rotate(${props => props.i * -18}deg);
  transform-origin: top right;
`;
const PassiveAbility = styled.div`
  display: flex;
  justify-content: center;
  width: 20px;
  height: 20px;
  align-self: center;
  align-content: center;
  border-radius: 10px;
  border-radius: 100%;
  border-style: solid;
  border-thickness: 1px;
  border-color: #152642;
  background-color: ${props => props.color};
  color: #152642;
  transform: rotate(
    ${props => (props.isReversed ? props.i * 18 - 90 : props.i * 18 - 30)}deg
  );
  pointer-events: auto;
  ${props => props.isOnCooldown ? "filter: brightness(1);" : "filter: brightness(.2);"}

  -webkit-transition-duration: 0.2s;
  transition-duration: .2s;
  transition-property: brightness;

  &::before {
    content: "";
    position: absolute;
    width: 77.46px;
    height: 214px;
    pointer-events: none;

  background-color: ${props => props.color};



    -webkit-mask-image: url('spritesheet/passiveAbilityActivationSprite_TEST.png');
    mask-image: url('spritesheet/passiveAbilityActivationSprite_TEST.png');


    // background: url("spritesheet/passiveAbilityActivationSprite_TEST.png");
    background-position: center;

    animation: ${props => props.isOnCooldown ? `play-particle .75s steps(11) 1 forwards` : 'empty-anim 1s infinite'};

    opacity: ${props => (props.isOnCooldown ? 0.3 : 0)};
    transition: opacity .5s ease-in-out;
    transform: translate(0px, -176px);
}

@keyframmes empty-anim{}

@keyframes play-particle {
    from {
    // background-position-x: 0px;
    // background-position-y: 214px;
      -webkit-mask-position: 0px 214px; 
      mask-position: 0px 214px;
  }
  to {
      -webkit-mask-position: -852px 214px; 
      mask-position: -852px 214px;
    // background-position-x: -852px;
    // background-position-y: 214px;
  }
}`;

const PassiveIcon = styled.i`
  display: flex;
  align-self: center;
`;
export const PassiveAbilities = ({
  accTime,
  isTeammate,
  setDisplayString,
  isReversed,
  abilities = []
}) => {

  const ICON_LOOKUP = {
    heart: "fa-gratipay",
    glass: "fa-tencent-weibo",
    fire: "fa-fire",
    wood: "fa-tree",
    lightning: "fa-hourglass-half",
    death: "fa-heartbeat",
    bubble: "fa-universal-access",
    metal: "fa fa-wrench",
    ice: "fa-thermometer-quarter"
  };

  const abilityButtons = Array(abilities.length).fill(0).map((_, i) => {
    const j = abilities.length - 1 - i;
    const a = abilities[i]; //abilities[j];

    const cooldownTime = a.passiveDurationTime ? a.passiveDurationTime : isTeammate ? a.cooldownTimeAI : a.cooldownTime;
    const isOnCooldown = a.accTime + cooldownTime > accTime;
    return (
      <PassiveAbilityWrapper i={j}>
        <PassiveAbility
          // ref={setHoverRef(`${data.displayLookup}Passive`)}
          key={j}
          isReversed={isReversed}
          i={j}
          title={a.passiveName}
          color={a.color}
          isOnCooldown={!!a.accTime && isOnCooldown} // ensure power has been cast once (a.accTime != 0) to highlight passive 
          isTeammate={isTeammate}
        >
          <PassiveIcon className={`fa ${ICON_LOOKUP[a.element]}`} />
        </PassiveAbility>
      </PassiveAbilityWrapper>
    )
  });
  return <Wrapper isReversed={isReversed}>{abilityButtons}</Wrapper>;
};
