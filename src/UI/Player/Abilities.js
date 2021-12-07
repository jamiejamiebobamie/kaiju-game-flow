import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Ability } from "./Ability";
// https://jsfiddle.net/194288aw/
// @keyframes rotation {
//   0% {
//     transform: rotate3d(0, 1, 0, 0deg);
//   }
//   50% {
//     transform: rotate3d(0, 1, 0, 180deg);
//   }
//   100% {
//     transform: rotate3d(0, 1, 0, 360deg);
//   }
// }
//
// .container {
//   background-color: blue;
//   width: 100px;
//   height: 100px;
// }
//
// .coin {
//   position: relative;
//   top: 25px;
//   left: 25px;
//   width: 50px;
//   height: 50px;
//   text-align: center;
//   line-height: 50px;
//   animation-name: rotation;
//   animation-iteration-count: infinite;
//   animation-timing-function: linear;
//   animation-duration: 2.5s;
// }
//
// .face {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   border-radius: 50%;
// }
//
// .heads {
//   background-color: green;
//   z-index: 2;
// }
//
// .tails {
//   background-color: gray;
//   z-index: 1;
// }

// <div class="container">
//   <div class="coin">
//     <div class="face heads">
//       Hey!
//     </div>
//     <div class="face tails">
//       Ho!
//     </div>
//   </div>
// </div>

const Wrapper = styled.div`
  display: flex;
  ${props =>
    props.isReversed ? "flex-flow: row wrap;" : "flex-flow: row wrap-reverse;"}
  justify-content: flex-start;
  width: 65%;
  height: 100%;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  overflow: scroll;
  overflow-y: scroll;
`;
const AbilityIcon = styled.img`
  margin-left: 10px;
  justify-self: center;
  align-self: center;
  border-radius: 100%;
  border-style: solid;
  min-width: 50px;
  height: 50px;
`;
export const Abilities = ({
  setDisplayString,
  isReversed,
  abilityArr = [
    { displayLookup: "abilityGlass" },
    { displayLookup: "abilityFire" },
    { displayLookup: "abilityWood" },
    { displayLookup: "abilityLightning" },
    { displayLookup: "abilityDeath" },
    { displayLookup: "abilityBubble" },
    { displayLookup: "abilityMetal" }
  ]
}) => {
  const abilityButtons = abilityArr.map((abilityData, i) => (
    <Ability setDisplayString={setDisplayString} abilityData={abilityData} />
  ));
  return <Wrapper isReversed={isReversed}>{abilityButtons}</Wrapper>;
};
