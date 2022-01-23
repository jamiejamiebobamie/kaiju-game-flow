import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.i`
  display: ${props => (props.lives > 0 ? "flex" : "none")};
  position: absolute;
  z-index: 20001;
  left: ${props => `${props.charLocation.x + 3.5}px`};
  top: ${props => `${props.charLocation.y}px`};
  color: ${props => props.color};
  ${props => props.isInManaPool && "animation: blinking 5s infinite;"}
  pointer-events: none;
}
@keyframes blinking{
  0%		{color: #10c018;}
  25%		{color: #1056c0;}
  50%		{color: #ef0a1a;}
  75%		{color: #254878;}
  100%	{color: #04a1d5;}
}
`;
const Character = styled.img`
    margin-left: -20px;
    margin-top: -45px;
    width: 50px;
    height: 75px;
    position: absolute;
    z-index: 1;
  ${props => props.isInManaPool && "animation: blinking 5s infinite;"}
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
@keyframes blinking{
  0%		{filter: invert(25%);}
  25%		{filter: invert(100%);}
  50%		{filter: invert(50%);}
  75%		{filter: invert(100%);}
  100%	{filter: invert(25%);}
}
`;
const Particle = styled.i`
color: ${props => props.color};

    animation: rise 5s infinite;
    position: absolute;
    z-index:2;
    width: 1px;
    height: 1px;
    pointer-events: none;
    transform: scale(.1);
    ${props => `@keyframes rise {
      0% {
        transform: translate(${props.x}px, ${props.y}px) scale(.5);
      }
      100% {
        transform: translate(${props.x}px, ${props.y - 500}px) scale(.5);
      }
    }`};
}
`;
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
  const [isDamaged, setIsDamaged] = useState(false);
  const [_isHealed, _setIsHealed] = useState(false);
  const [_isTeleported, _setIsTeleported] = useState(false);
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (!isHealed) {
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 4000);
    }
  }, [lives]);
  useEffect(() => {
    if (!_isHealed) {
      _setIsHealed(true);
      const _particles = [];
      for (let i = 0; i < 5; i++) {
        _particles.push(
          <Particle
            x={
              Math.random() > 0.5
                ? -1 * Math.random() + charLocation.x
                : Math.random() + charLocation.x
            }
            y={
              Math.random() > 0.5
                ? -1 * Math.random() + charLocation.y
                : Math.random() + charLocation.y
            }
            className={`fa ${
              _isTeleported ? "fa-angle-double-up" : "fa-heart-o"
            }`}
            color={_isTeleported ? "maroon" : "pink"}
          />
        );
      }
      setParticles(_particles);
      setTimeout(() => _setIsHealed(false), 2000);
    }
  }, [isHealed]);
  useEffect(() => {
    if (!_isTeleported) {
      _setIsTeleported(true);
      const _particles = [];
      for (let i = 0; i < 5; i++) {
        _particles.push(
          <Particle
            x={
              Math.random() > 0.5
                ? -1 * Math.random() + charLocation.x
                : Math.random() + charLocation.x
            }
            y={
              Math.random() > 0.5
                ? -1 * Math.random() + charLocation.y
                : Math.random() + charLocation.y
            }
            className={`fa ${
              _isTeleported ? "fa-angle-double-up" : "fa-heart-o"
            }`}
            color={_isTeleported ? "maroon" : "pink"}
          />
        );
      }
      setParticles(_particles);
      setTimeout(() => _setIsTeleported(false), 2000);
    }
  }, [isTeleported]);
  return (
    <Wrapper lives={lives} charLocation={charLocation}>
      {(_isTeleported || _isHealed) && particles}
      <p>{dir}</p>
      <Character
        isDamaged={isDamaged}
        color={color}
        isInManaPool={isInManaPool}
        src={color === "blue" ? "player.png" : "teammate.png"}
      />
    </Wrapper>
  );
};
