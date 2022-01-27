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
    z-index: 20001;
    left: ${props => `${props.charLocation.x}px`};
    top: ${props => `${props.charLocation.y}px`};
    pointer-events: none;
}`;
const MonsterImg = styled.img`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  width: 40px;
  height: 40px;
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
`;
const HealthBarWrapper = styled.div`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  width: 40px;
  justify-content: center;
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
export const Kaiju = ({ dir, charLocation, element, color, lives }) => {
  const [healthModifierText, setHealthModifierText] = useState([]);
  const [isDamaged, setIsDamaged] = useState(null);
  useEffect(() => {
    if (!isDamaged) {
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(null), 2000);
    }
    setHealthModifierText(prevText => [
      ...prevText,
      <ModiferText
        randShift={Math.random() > 0.5 ? Math.random() * -5 : Math.random() * 5}
        color={"red"}
      >
        -1
      </ModiferText>
    ]);
  }, [lives]);
  const bars = [];
  for (let i = 0; i < lives; i++) bars.push(<Bar lives={lives} key={i} />);
  // <p style={{ position: "absolute", zIndex: 3, color: "white" }}>{dir}</p>
  return (
    <Monster lives={lives} charLocation={charLocation}>
      {healthModifierText}
      <HealthBarWrapper lives={lives}>{bars}</HealthBarWrapper>
      <MonsterImg lives={lives} isDamaged={isDamaged} src={"kaiju.png"} />
    </Monster>
  );
};
