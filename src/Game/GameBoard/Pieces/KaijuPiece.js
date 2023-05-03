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
const MonsterImg = styled.img`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  width: 40px;
  height: 40px;
  animation-iteration-count: 1s;
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
`;
const SpriteSheet = styled.div`
  pointer-events: none;
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  background: url("spritesheet/kaiju.png");
  transform: scale(0.4) translate(-130px, -165px);
  height: 200px;
  width: 152px;
  filter: drop-shadow(0 0 3px #bf40bf);
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
export const Kaiju = ({ zIndex, dir, charLocation, element, color, lives }) => {
  const [healthModifierText, setHealthModifierText] = useState([]);
  const [isDamaged, setIsDamaged] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [anim, setAnim] = useState("down");
  // console.log(dir);
  useEffect(() => {
    dir && setAnim(dir === "idle" ? `${dir}${anim}` : dir);
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
  // <p style={{ position: "absolute", zIndex: 3, color: "white" }}>{dir}</p>
  return (
    <Monster zIndex={zIndex} lives={lives} charLocation={charLocation}>
      {healthModifierText}
      <HealthBarWrapper lives={lives}>{bars}</HealthBarWrapper>
      <Character isDamaged={isDamaged}>
        <SpriteSheet lives={lives} anim={anim} color={color} />
      </Character>
    </Monster>
  );
};
// <MonsterImg lives={lives} isDamaged={isDamaged} src={"kaiju.png"} />
