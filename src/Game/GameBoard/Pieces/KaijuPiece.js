import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Monster = styled.div`
    position: absolute;
    display: ${props => (props.lives > 0 ? "flex" : "none")};
    justify-content: center;
    flex-direction:column;
    margin-left: -15px;
    margin-top: -25px;
    display: ${props =>
    props.charLocation.x < 0 ||
      props.charLocation.x > 500 ||
      props.charLocation.y < 0 ||
      props.charLocation.y > 800
      ? "none"
      : "flex"};
    width: 40px;
    height: 40px;
    ${props =>
    props.zIndex ? `z-index: ${props.zIndex + 20002}` : "z-index:20002"};
    left: ${props => `${props.charLocation.x}px`};
    top: ${props => `${props.charLocation.y}px`};
    pointer-events: none;
}`;
const SpriteSheet = styled.div`
  position: relative;
  pointer-events: none;
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  background: url("spritesheet/kaiju_sprite2.png");
  transform: scale(0.4) translate(-169px, -169px);
  height: 230.33px;
  width: 180px;
  filter: drop-shadow(0 0 20px #bf40bf);
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition: -webkit-transform 3s ease-in-out;
  ${props => `animation: ${props.anim} 1.25s steps(10) infinite;`};

  &::before {
    content: "";
    position: absolute;
    height: 230.33px;
    width: 180px;
    pointer-events: none;

    background: url("spritesheet/kaiju_sprite_FIRE1.png");
    background-position: center;

    ${props => `animation: ${props.anim} 1.25s steps(10) infinite;`};

    opacity: ${props => (props.isGoingToSpewFire ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;
  }

  @keyframes upRightKaiju {
    from {
      background-position-x: 0px;
      background-position-y: 0px;
    }
    to {
      background-position-x: -1800px;
      background-position-y: 0px;
    }
  }
  @keyframes upKaiju  {
    from {
      background-position-x: 0px;
      background-position-y: 230.33px;
    }
    to {
      background-position-x: -1800px;
      background-position-y: 230.33px;
    }
  }
  @keyframes upLeftKaiju {
    from {
      background-position-x: 0px;
      background-position-y: 460.66px;
    }
    to {
      background-position-x: -1800px;
      background-position-y: 460.66px;
    }
  }
  @keyframes downLeftKaiju {
    from {
      background-position-x: 0px;
      background-position-y: 691px;
    }
    to {
      background-position-x: -1800px;
      background-position-y: 691px;
    }
  }
  @keyframes downKaiju {
    from {
      background-position-x: 0px;
      background-position-y: 921.33px;
    }
    to {
      background-position-x: -1800px;
      background-position-y: 921.33px;
    }
  }
  @keyframes downRightKaiju {
    from {
      background-position-x: 0px;
      background-position-y: 1151.66px;
    }
    to {
      background-position-x: -1800px;
      background-position-y: 1151.66px;
    }
  }
`;

const HealthBarWrapper = styled.div`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  width: 40px;
  justify-content: center;
  // background-color: yellow;
  margin-top: -70px;
  // margin-left: -10px;
`;
const Bar = styled.div`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  width: 7px;
  height: 3px;
  margin: 1px;
  margin-top: -5px;
  align-self: center;
  border-radius: 3px;
  border-style: solid;
  border-width: thin;
  background: linear-gradient(45deg, #d22b2b, #880808);
  border-color: #880808;
  pointer-events: none;
  margin-top: -15px;
`;
const ModiferText = styled.p`
  position: absolute;
  margin-left: ${props => props.randShift}px;
  margin-top: -30px;
  z-index: 20002;
  opacity: 0;
  color: red;
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
const Character = styled.div`
    // margin-left: 0px;
    // margin-top: -10px;
    // background-color:red;
    // opacity: .5;
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
export const Kaiju = ({ zIndex, dir, charLocation, color, lives, isGoingToSpewFire }) => {
  const [healthModifierText, setHealthModifierText] = useState([]);
  const [isDamaged, setIsDamaged] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [anim, setAnim] = useState("down");

  useEffect(() => {
    dir && setAnim(dir === "idle" ? `downKaiju` : `${dir}Kaiju`);
  }, [dir]);
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else if (!isDamaged && lives) {
      setIsDamaged(true);
      setHealthModifierText(prevText => [
        ...prevText,
        <ModiferText color={"#FF383B"}>{"-1"}</ModiferText>
      ]);
      setTimeout(() => setIsDamaged(null), 1000);
    } else if (!lives) {
      setHealthModifierText([]);
    }
  }, [lives]);
  const bars = [];
  for (let i = 0; i < lives; i++) bars.push(<Bar lives={lives} key={i} />);
  return (
    <Monster zIndex={zIndex} lives={lives} charLocation={charLocation}>
      {healthModifierText}
      <HealthBarWrapper lives={lives}>{bars}</HealthBarWrapper>
      <Character isDamaged={isDamaged}>
        <SpriteSheet isGoingToSpewFire={isGoingToSpewFire} lives={lives} anim={anim} color={color} />
      </Character>
    </Monster>
  );
};
