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
  setDisplayString,
  isReversed,
  abilityArr = [
    { displayLookup: "abilityGlass", element: "glass" },
    { displayLookup: "abilityFire", element: "fire" },
    { displayLookup: "abilityWood", element: "wood" },
    { displayLookup: "abilityLightning", element: "lightning" },
    { displayLookup: "abilityDeath", element: "death" },
    { displayLookup: "abilityBubble", element: "bubble" },
    { displayLookup: "abilityMetal", element: "metal" }
  ]
}) => {
  const abilityButtons = abilityArr.map((abilityData, i) => (
    <Ability
      key={i}
      setDisplayString={setDisplayString}
      abilityData={abilityData}
    />
  ));
  return <Wrapper isReversed={isReversed}>{abilityButtons}</Wrapper>;
};
