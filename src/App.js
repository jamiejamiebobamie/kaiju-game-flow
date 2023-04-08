import React, { useState, useEffect } from "react";
import { Home } from "./Home";
import styled, { css } from "styled-components";

import "./App.css";

const TransitionWrapper = styled.div`
  position: absolute;
  width: 100dvw;
  height: 100dvh;
  // background-color: pink;
  // opacity: 0.5;
  z-index: 9999999999;
  pointer-events: none;
`;

const TransitionStrip = styled.div`
  position: absolute;
  width: 100dvw;
  height: 150px;
  border-radius: 150px;
  z-index: 99999999999;
  @keyframes moveRight {
    0% {
      right: -95dvw;
    }
    50% {
      right: -5dvw;
    }
    100% {
      right: -95dvw;
    }
  }

  @keyframes moveLeft {
    0% {
      left: -95dvw;
    }
    50% {
      left: -5dvw;
    }
    100% {
      left: -95dvw;
    }
  }

  ${props =>
    props.duration !== undefined && ` animation-duration: ${props.duration}s;`}
  ${props => props.top !== undefined && `top: ${props.top * 40}px;`}
  ${props =>
    props.shouldPlay &&
    css`
      ${props.isLeft
        ? `
      left: -100dvw;
      animation-name: moveLeft;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1));
      `
        : `
      right: 100dvw;
      animation-name: moveRight;
      background: linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 1));
      `}
    `}
`;

const App = () => {
  const ANIM_DELAY_MILLI = 1500;
  const [transition, setTransition] = useState([]);
  const [shouldPlayAnim, setShouldPlayAnim] = useState(true);
  useEffect(() => {
    setTimeout(() => setShouldPlayAnim(false), 4000);
  }, []);
  useEffect(() => {
    const seconds = ANIM_DELAY_MILLI / 1000;
    const durations = Array(44)
      .fill(0)
      .map((_, i) => Math.random() * seconds + seconds);
    const transition = Array(44)
      .fill(0)
      .map((_, i) => (
        <TransitionStrip
          key={i}
          isLeft={!(i % 2)}
          duration={durations[i]}
          top={i - (i % 2) - 1}
          shouldPlay={shouldPlayAnim}
        />
      ));
    setTransition(transition);
  }, [shouldPlayAnim]);
  const triggerTransition = callback => {
    setShouldPlayAnim(shouldPlayAnim => {
      if (!shouldPlayAnim) {
        setTimeout(() => setShouldPlayAnim(false), 3500);
        callback && setTimeout(() => callback(), 500);
        const shouldPlayAnim = true;
        return shouldPlayAnim;
      } else {
        return shouldPlayAnim;
      }
    });
  };
  return (
    <div className="App">
      <TransitionWrapper>{transition}</TransitionWrapper>
      <Home triggerTransition={triggerTransition} />
    </div>
  );
};

export default App;
