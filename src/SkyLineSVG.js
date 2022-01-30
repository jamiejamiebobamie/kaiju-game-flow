import React from "react";
import styled from "styled-components";
import { getRandomIntInRange } from "./Utils/utils";

export const SkyLineSVG = ({ x, y, zIndex }) => {
  const Wrapper = styled.svg`
    position: absolute;
    z-index: ${props => props.zIndex};
    margin-top: -450px;

    width: 75%;
    height: 85%;

    pointer-events: none;
    ${props => `left: ${props.x}px; top:500px;`};
    /* background-color: red; */
    /* opacity: 0.3; */
    transform: scale(1, 1.5);
  `;
  const StyledSVG = styled.svg`
    pointer-events: none;
    ${props => `left: ${props.x}px; top:500px;`};
    /* background-color: red; */
    /* opacity: 0.3; */
  `;
  const StyledCircle = styled.circle`
    transform: scale(1.5, 1);
    ${props => `animation: blinker ${props.randDur}s linear infinite;`}
    @keyframes blinker {
      0% {
        opacity: 0.5;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 0.5;
      }
    }

    /* color: red; */
  `;
  // ${props => ` transform: scale(${props.scaleX}, ${props.scaleY});`};

  const buildingArray = [
    {
      str: "v -7 h 5 v -7 h 2 v 3 h 5 v 11",
      lowestV: -7,
      width: 8,
      heightChange: 0,
      lights: [{ x: 4, y: 15 }]
      // lights: [{ x: 4, y: 20 }]
    },
    {
      str: "v -8 h 4 v -4 h 7 v 4 h 3 v 8",
      lowestV: -8,
      width: 14,
      heightChange: 0
    },
    {
      str:
        "v -47 h 7 v -3 h 5 v 3 h 7 v 47 h 4 v -47 h 7 v -3 h 5 v 3 h 7 v 47",
      lowestV: -47,
      width: 28,
      heightChange: 0,
      lights: [
        { x: 6, y: 51 },
        { x: 22, y: 51 }
      ]
      // lights: [
      //   { x: 6, y: 96 },
      //   { x: 22, y: 96 }
      // ]
    },
    { str: "h 15", lowestV: 0, width: 15, heightChange: 0 },
    {
      str: "v -20 h 2 v -5 h 7 v -5 h 5 v -3 h 5 v 33",
      lowestV: -20,
      width: 19,
      heightChange: 0
    },
    {
      str: "v -63 h 15 v -4 h 5 v 4 h 25 v 62",
      lowestV: -63,
      width: 30,
      heightChange: 0,
      lights: [{ x: 13, y: 67 }]
      // lights: [{ x: 13, y: 130 }]
    },
    { str: "h 8", lowestV: 0, width: 0, heightChange: 0 },
    {
      str: "v -8 h 4 v -10 h 2 v -15 h 15 v 7 h 5 v 13 h 6 v 12 h 4 v 24",
      lowestV: -15,
      width: 36,
      heightChange: 0
    },
    { str: "h 5", lowestV: 0, width: 5, heightChange: 0 },
    {
      str:
        "v -13 h 6 v -9 h 2 v -25 h 4 v -65 h 2 v -4 h 8 v -13 h 1 v -5 h 1 v 5 h 2 v 13 h 18 v 65 h 9 v 35",
      lowestV: -65,
      width: 35,
      heightChange: 0,
      lights: [{ x: 16, y: 135 }]
      // lights: [{ x: 16, y: 200 }]
    },
    { str: "h 10", lowestV: 0, width: 10, heightChange: 0 },
    {
      str: "v -79 h 10 v -37 h 5 v -8 h 30 v 6 h 7 v 6 h 4 v 40 h 5 v 72",
      lowestV: -79,
      width: 56,
      heightChange: 0
    },
    {
      str: "h 5 v 1 h 3 v -7 h 6",
      lowestV: -7,
      width: 14,
      heightChange: 0
    }
  ];
  const test = [
    ...buildingArray,
    ...buildingArray,
    ...buildingArray,
    ...buildingArray
  ];
  let isPastTitle = false;
  const titleWidth = 300;
  let original;
  const cityLights = [];
  const skylineCoordsObj = test.reduce(
    (acc, _) => {
      const newPiece =
        buildingArray[getRandomIntInRange({ max: buildingArray.length - 1 })];
      newPiece.lights &&
        newPiece.lights.forEach(lightCoords =>
          cityLights.push(
            <StyledCircle
              cx={`${acc.width + lightCoords.x}`}
              cy={`${acc.height - lightCoords.y}`}
              r="1"
              fill="red"
              filter="url(#sofGlow)"
              randDur={Math.random() * 3 + 1}
            />
          )
        );
      const newWidth = acc.width + newPiece.width;
      const newHeight = acc.height + newPiece.heightChange;
      const isBuilding = newWidth < 450;
      console.log(newWidth, newHeight);
      const curr = {
        width: isBuilding ? newWidth : acc.width,
        height: newHeight,
        strArr: isBuilding ? [...acc.strArr, newPiece.str] : acc.strArr, // [...acc.strArr, `h ${titleWidth}`],
        lowestV: acc.lowestV > newPiece.lowestV ? newPiece.lowestV : acc.lowestV
      };
      // isPastTitle = !isBuilding;
      return curr;
    },
    { strArr: [], width: 0, height: 300, lowestV: Number.MAX_SAFE_INTEGER }
  );
  const skylineCoords =
    "M 0 300" +
    //  v" +
    // String(skylineCoordsObj.lowestV) +
    // " " +
    skylineCoordsObj.strArr.join("") +
    "V 300";
  console.log(skylineCoords);
  return (
    <Wrapper zIndex={zIndex}>
      <StyledSVG
        width="750"
        height="500"
        xmlns="http://www.w3.org/2000/svg"
        x={x}
        y={y}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
          <linearGradient id="cityFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="10%" stop-color="#db974f" />
            <stop offset="90%" stop-color="#db974f" stop-opacity="0" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
          <filter id="sofGlow" height="2000%" width="2000%" x="-500%" y="-500%">
            <feMorphology
              operator="dilate"
              radius="4"
              in="SourceAlpha"
              result="thicken"
            />
            <feGaussianBlur in="thicken" stdDeviation="4" result="blurred" />
            <feFlood flood-color="rgb(201, 25, 22)" result="glowColor" />
            <feComposite
              in="glowColor"
              in2="blurred"
              operator="in"
              result="softGlow_colored"
            />
            <feMerge>
              <feMergeNode in="softGlow_colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={skylineCoords} //"M 0 200 h 5 v 1 h 3 v -7 h 6"
          fill="transparent"
          // stroke="black"
          // stroke-width="2"
          fill="url(#cityFade)"
          // fill="black"
        />
        {cityLights}
      </StyledSVG>
    </Wrapper>
  );
};
// <StyledCircle cx="25" cy="75" r="1" />
