import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ICON_LOOKUP } from 'Utils/gameState';

const Wrapper = styled.div`
  position: absolute;
  right: 20px;
  width: 100px;
  height: 0px;
  transform: rotate(${props => props.i * -18}deg);
  transform-origin: top right;
`;
const PassiveAbilityWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 20px;
  height: 20px;
  align-self: center;
  align-content: center;
  border-radius: 100%;
  background-color: ${props => props.color};
  color: #152642;
  transform: rotate(${props => props.i * 18 - 90}deg
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
    background-position: center;

    -webkit-mask-image: url('spritesheet/passiveAbilityActivationSprite_TEST.png');
    mask-image: url('spritesheet/passiveAbilityActivationSprite_TEST.png');
    animation: ${props =>
    props.isOnCooldown && !props.isPassiveRetriggered ?
      'play-particle1 .75s steps(11) 1 forwards'
      : props.isPassiveRetriggered ?
        'play-particle2 .75s steps(11) 1 forwards'
        : 'empty-anim 1s infinite'
  };

    opacity: ${props => (props.isOnCooldown ? 0.3 : 0)};
    transition: opacity .5s ease-in-out;
    transform: translate(0px, -176px);
  }

  @keyframes empty-anim{}
  @keyframes play-particle1 {
    from {
      -webkit-mask-position: 0px 214px; 
      mask-position: 0px 214px;
    }
    to {
        -webkit-mask-position: -852px 214px; 
        mask-position: -852px 214px;
    }
  }
  @keyframes play-particle2 {
    from {
      -webkit-mask-position: 0px 214px; 
      mask-position: 0px 214px;
    }
    to {
        -webkit-mask-position: -852px 214px; 
        mask-position: -852px 214px;
    }
  }    
`;

const PassiveIcon = styled.i`
  display: flex;
  align-self: center;
`;

export const PassiveAbility = ({
  i,
  element,
  passiveName,
  color,
  isOnCooldown,
  isTeammate,
  accTime
}) => {

  const timeoutRef = useRef();
  const [isPassiveRetriggered, setIsPassiveRetriggered] = useState(false);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setIsPassiveRetriggered(true);
    timeoutRef.current = setTimeout(() => {
      setIsPassiveRetriggered(false);
    }, 1000);
  }, [accTime])

  return (<Wrapper i={i}>
    <PassiveAbilityWrapper
      key={i}
      i={i}
      title={passiveName}
      color={color}
      isOnCooldown={isOnCooldown} // ensure power has been cast once (a.accTime != 0) before highlighting passive 
      isTeammate={isTeammate}
      accTime={isPassiveRetriggered}
    >
      <PassiveIcon className={`fa ${ICON_LOOKUP[element]}`} />
    </PassiveAbilityWrapper>
  </Wrapper>)
}