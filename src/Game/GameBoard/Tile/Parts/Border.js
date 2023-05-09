import React from "react";
import styled from "styled-components";

const HexagonHalf = styled.div`
  position: absolute;
  pointer-events: none;
  z-index: ${props => (props.isFlipped ? 2 : 1)};
  ${props =>
    props.isFlipped
      ? "transform: rotate(180deg) translate(-161px, -140px);"
      : null};
  div:nth-child(1) {
    transform: rotate(30deg) translate(50px);
    z-index: 1;
  }
  div:nth-child(2) {
    transform: rotate(90deg) translate(5px, -78px);
    z-index: 2;
  }
  div:nth-child(3) {
    transform: rotate(-30deg) translate(85px, 78px);
    z-index: 3;
  }
  div:nth-child(4) {
    transform: rotate(-130deg) translate(-114px, 41px);
    z-index: 4;
  }
  div:nth-child(5) {
    transform: rotate(150deg) translate(50px);
    z-index: 5;
  }
  div:nth-child(6) {
    transform: rotate(180deg) translate(50px);
    z-index: 6;
  }
`;
const Line = styled.div`
  position: absolute;
  // opacity: 0.7;
  // background-color: #a54dff;

  ${props =>
    props.color
      ? `background-color: ${props.color}; opacity: .3;`
      : `${
          props.isTutorial
            ? "background-color: #db974f; opacity: 0.3;"
            : // : "background-color: #a54dff; opacity: .3;"
              "background-color: lightgrey; opacity: .2;"
        }`}

  // #db974f;
  width: 5px;
  height: 50px;
  border: 0.5px;
  border-radius: 50px;
  pointer-events: none;
  // filter: drop-shadow(0 0 10px #a54dff);
`;
export const Border = ({ color, isTutorial }) => {
  return (
    <>
      <HexagonHalf>
        <Line isTutorial={isTutorial} color={color} />
        <Line isTutorial={isTutorial} color={color} />
        <Line isTutorial={isTutorial} color={color} />
      </HexagonHalf>
      <HexagonHalf isFlipped>
        <Line isTutorial={isTutorial} color={color} />
        <Line isTutorial={isTutorial} color={color} />
        <Line isTutorial={isTutorial} color={color} />
      </HexagonHalf>
    </>
  );
};
