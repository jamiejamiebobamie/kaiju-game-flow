import React, { useState, useEffect } from "react";
import { Home } from "./Home";
import styled, { css } from "styled-components";

import "./App.css";

const TransitionWrapper = styled.div`
  position: absolute;
  width: 100dvw;
  height: 100dvh;
  z-index: 99999999999;
  pointer-events: none;
`;
const TransitionStrip = styled.div`
  position: absolute;
  height: 150px;
  border-radius: 150px;
    // box-shadow: 3px 7px 10px black;
  ${props =>
    props.duration !== undefined && `z-index: ${99999999999 + props.duration};`}
  @keyframes moveRight {
    0% {
      right: -100dvw;
      width: 100dvw;
    }
    45% {
      right: 25dvw;
    }
    50% {
      right: 50dvw;
      ${props =>
        props.duration !== undefined && `width: ${90 / props.duration}dvw;`}
    }
    55% {
      right: 25dvw;
    }
    100% {
      right: -100dvw;
      width: 100dvw;
    }
  }

  @keyframes moveLeft {
    0% {
      left: -100dvw;
      width: 100dvw;
    }
    45% {
      left: 25dvw;
    }
    50% {
      left: 50dvw;
      ${props =>
        props.duration !== undefined && `width: ${90 / props.duration}dvw;`}
    }
    55% {
      left: 25dvw;
    }
    100% {
      left: -100dvw;
      width: 100dvw;
    }
  }

  ${props =>
    props.duration !== undefined && ` animation-duration: ${props.duration}s;`}
  ${props => props.top !== undefined && `top: ${props.top * 50}px;`}
  ${props =>
    props.shouldPlay &&
    css`
      ${props.isLeft
        ? `
      left: -100dvw;
      animation-name: moveLeft;
      background: linear-gradient(to right, rgba(227, 241, 255, 1), rgba(227, 241, 255, 1));
      `
        : `
      right: 100dvw;
      animation-name: moveRight;
      background: linear-gradient(to left, rgba(227, 241, 255, 1), rgba(227, 241, 255, 1));
      `}
    `}
`;
// top={i - (i % 2) - 1}

const App = () => {
  const ANIM_DELAY_MILLI = 1500;
  const [transition, setTransition] = useState([]);
  const [shouldPlayAnim, setShouldPlayAnim] = useState(false);
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
        setTimeout(() => setShouldPlayAnim(false), 3000);
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
