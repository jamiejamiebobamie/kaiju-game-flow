import React from "react";
import styled from "styled-components";
import { Ability } from "./Ability";

const Wrapper = styled.div`
  display: flex;
  ${props =>
    props.isReversed ? "flex-flow: row wrap;" : "flex-flow: row wrap-reverse;"}
  justify-content: flex-start;
  ${props =>
    props.shiftContentOver
      ? "width: 150%;margin-left:-125px;justify-content: center;"
      : "width: 65%;"};
  height: 100%;
  overflow: none;
`;
export const Abilities = ({
  shiftContentOver,
  playerIndex,
  kaijuData,
  playerData,
  setPlayerData,
  setTeleportData,
  setTileStatuses,
  scale,
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
      playerData={playerData}
      setPlayerData={setPlayerData}
      setTeleportData={setTeleportData}
      kaijuData={kaijuData}
      setTileStatuses={setTileStatuses}
      scale={scale}
      setDisplayString={setDisplayString}
      abilityData={abilityData}
      keyNum={i + 1}
      playerIndex={playerIndex}
    />
  ));
  return (
    <Wrapper shiftContentOver={shiftContentOver} isReversed={isReversed}>
      {abilityButtons}
    </Wrapper>
  );
};
