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
export const Kaiju = ({ dir, charLocation, element, color, lives }) => {
  const [isDamaged, setIsDamaged] = useState(false);
  useEffect(() => {
    if (lives < 3) {
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 2000);
    }
  }, [lives]);
  const bars = [];
  for (let i = 0; i < lives; i++) bars.push(<Bar lives={lives} key={i} />);
  return (
    <Monster lives={lives} charLocation={charLocation}>
      <p style={{ position: "absolute", zIndex: 3, color: "white" }}>{dir}</p>
      <HealthBarWrapper lives={lives}>{bars}</HealthBarWrapper>
      <MonsterImg lives={lives} isDamaged={isDamaged} src={"kaiju.png"} />
    </Monster>
  );
};
