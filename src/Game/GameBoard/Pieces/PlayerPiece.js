import React, { useEffect, useState } from "react";
import styled from "styled-components";
import _ from "lodash";

const Wrapper = styled.i`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.charLocation.x + 3.5}px`};
  top: ${props => `${props.charLocation.y}px`};
  color: ${props => props.color};
  pointer-events: none;
`;

// ${props =>
//   props.anim &&
//   `animation: ${props.anim} 0.3s steps(${
//     props.dir === "idle" ? 1 : 10
//   }) infinite;`};
const SpriteSheet = styled.div`
  pointer-events: none;
  ${props =>
    props.color === "blue"
      ? 'background: url("spritesheet/player.png");'
      : 'background: url("spritesheet/teammate.png");'}
  transform: scale(.4) translate(-130px, -165px);
  height: 200px;
  width: 152px;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition: -webkit-transform 3s ease-in-out;
  ${props => `animation: ${props.anim} 1s steps(10) infinite;`};
  @keyframes upRight {
    from {
      background-position-x: -152px;
      background-position-y: 0px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 0px;
    }
  }
  @keyframes up {
    from {
      background-position-x: -152px;
      background-position-y: 220px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 220px;
    }
  }
  @keyframes upLeft {
    from {
      background-position-x: -152px;
      background-position-y: 440px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 440px;
    }
  }
  @keyframes downLeft {
    from {
      background-position-x: -152px;
      background-position-y: 660px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 660px;
    }
  }
  @keyframes down {
    from {
      background-position-x: -152px;
      background-position-y: 880px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 880px;
    }
  }
  @keyframes downRight {
    from {
      background-position-x: -152px;
      background-position-y: 1100px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 1100px;
    }
  }

  @keyframes idleupRight {
    from {
      background-position-x: 0px;
      background-position-y: 0px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 0px;
    }
  }
  @keyframes idleup {
    from {
      background-position-x: 0px;
      background-position-y: 220px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 220px;
    }
  }
  @keyframes idleupLeft {
    from {
      background-position-x: 0px;
      background-position-y: 440px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 440px;
    }
  }
  @keyframes idledownLeft {
    from {
      background-position-x: 0px;
      background-position-y: 660px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 660px;
    }
  }
  @keyframes idledown {
    from {
      background-position-x: 0px;
      background-position-y: 880px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 880px;
    }
  }
  @keyframes idledownRight {
    from {
      background-position-x: 0px;
      background-position-y: 1100px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 1100px;
    }
  }
`;
const Character = styled.div`
    margin-left: -20px;
    margin-top: -45px;
    width: 50px;
    height: 75px;
    position: absolute;
    z-index: 1;
  pointer-events: none;
  animation-iteration-count: 2s;
  ${props => props.isDamaged && "animation: shake 0.5s;"};
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }
}
`;
const ModiferText = styled.p`
  position: absolute;
  margin-top: -30px;
  z-index: 20002;
  opacity: 0;
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : "17px")};
  ${Math.random() > 0.5
    ? `margin-left: ${Math.random() * 10}px`
    : `margin-right: ${Math.random() * 10}px`};
  color: ${props => props.color};
  animation-timing-function: ease-in;
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
  -webkit-animation-name: textRise;
  animation-name: textRise;
  @keyframes textRise {
    0% {
      opacity: 0;
      transform: translateY(0px);
    }
    10% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-30px);
    }
  }
`;

/*

dir => direction -> idle

anim => need dir when dir changes to idle.
*/

export const Player = ({
  dir,
  lives,
  charLocation,
  isInManaPool,
  isHealed,
  isTeleported,
  color,
  i = 0
}) => {
  const [modifierText, setModifierText] = useState([]);
  const [isDamaged, setIsDamaged] = useState(null);
  const [isHealedLocal, setIsHealedLocal] = useState(false);
  const [isHealedCached, setIsHealedCached] = useState(isHealed);
  const [isTeleportedLocal, setIsTeleportedLocal] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [anim, setAnim] = useState("down");
  useEffect(() => {
    console.log(dir, anim);
    dir && setAnim(dir === "idle" ? `${dir}${anim}` : dir);
  }, [dir]);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      if (isHealed === isHealedCached && !isDamaged) {
        setIsDamaged(true);
        setModifierText(prevText => [
          ...prevText,
          <ModiferText key={Math.random()} color={"#FF383B"}>
            {"-1"}
          </ModiferText>
        ]);
        setTimeout(() => setIsDamaged(null), 2000);
      }
    }
  }, [lives]);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      if (!isHealedLocal) {
        setIsHealedLocal(true);
        setTimeout(() => setIsHealedLocal(false), 2000);
        setModifierText(prevText => [
          ...prevText,
          <ModiferText key={Math.random()} color={"#9FEA4F"}>
            {"+1"}
          </ModiferText>
        ]);
      }
    }
    setIsHealedCached(isHealed);
  }, [isHealed]);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      if (!isTeleportedLocal) {
        setIsTeleportedLocal(true);
        setTimeout(() => setIsTeleportedLocal(false), 2000);
        setModifierText(prevText => [
          ...prevText,
          <ModiferText key={Math.random()} fontSize={13} color={"#9338E9"}>
            Zip!
          </ModiferText>
        ]);
      }
    }
  }, [isTeleported]);
  return (
    <Wrapper lives={lives} charLocation={charLocation}>
      {modifierText}
      <Character isDamaged={isDamaged}>
        <SpriteSheet anim={anim} color={color} />
      </Character>
    </Wrapper>
  );
};
