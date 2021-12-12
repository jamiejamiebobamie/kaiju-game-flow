import React from "react";
import styled from "styled-components";
import { Ability } from "./Ability";

const Wrapper = styled.div`
  display: flex;
  ${props =>
    props.isReversed ? "flex-flow: row wrap;" : "flex-flow: row wrap-reverse;"}
  justify-content: flex-start;
  width: 65%;
  height: 100%;
  overflow: scroll;
  overflow-y: scroll;
`;
export const Abilities = ({
  ghosts,
  setDisplayString,
  isReversed,
  abilities = [
    {
      displayLookup: "abilityGlass",
      element: "glass",
      isPassive: false,
      isActive: false
    },
    {
      displayLookup: "abilityFire",
      element: "fire",
      isPassive: false,
      isActive: false
    },
    {
      displayLookup: "abilityWood",
      element: "wood",
      isPassive: false,
      isActive: false
    },
    {
      displayLookup: "abilityLightning",
      element: "lightning",
      isPassive: false,
      isActive: false
    },
    {
      displayLookup: "abilityDeath",
      element: "death",
      isPassive: false,
      isActive: false
    },
    {
      displayLookup: "abilityBubble",
      element: "bubble",
      isPassive: false,
      isActive: false
    },
    {
      displayLookup: "abilityMetal",
      element: "metal",
      isPassive: false,
      isActive: false
    }
  ]
}) => {
  const abilityButtons = abilities.map((abilityData, i) => (
    <Ability
      key={i}
      setDisplayString={setDisplayString}
      abilityData={abilityData}
      keyNum={i + 1}
      ghosts={ghosts}
    />
  ));
  return <Wrapper isReversed={isReversed}>{abilityButtons}</Wrapper>;
};
