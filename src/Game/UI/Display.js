import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useInterval } from "../../Utils/utils";

const getDescription = (string, playerData, playerIndex) => {
  switch (string) {
    case "modifiers":
      return {
        title: playerIndex === 1 ? "Your teammate" : "You",
        description: "",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "class":
      return {
        title:
          playerData &&
          playerData[playerIndex] &&
          playerData[playerIndex].playerClass &&
          `Class: ${playerData[playerIndex].playerClass}`,
        description:
          playerData &&
          playerData[playerIndex] &&
          playerData[playerIndex].playerClassDescription &&
          playerData[playerIndex].playerClassDescription,
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityHeartActive":
      return {
        title: "Heal",
        description: "Heal your teammate up to maximum health.",
        effect1: "Heal will follow its target between tiles.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityHeartPassive":
      return {
        title: "Good Vibes",
        description: "You send out good vibes.",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityMetalPassive":
      return {
        title: "Builder",
        description: "Your magic is larger, goes farther, and lasts longer.",
        effect1: "+1 number of tiles modifier",
        effect2: "+1 tile count modifier",
        img: "",
        formatData: {}
      };
      break;
    case "abilityMetalActive":
      return {
        title: "Aegis",
        description:
          "Create a large area of protection around you. Blocking many ranged attacks.",
        effect1: "Status remains on the tile until walked on.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityGlassPassive":
      return {
        title: "Teleport Sickness",
        description: "Zipping through space-time makes you nauseous.",
        effect1: "-2 to move speed",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityGlassActive":
      return {
        title: "Escape",
        description: "Instantly travel to a safe tile.",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityIcePassive":
      return {
        title: "Inclement Weather",
        description: "The forecast calls for snow.",
        effect1: "-1 to move speed",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityIceActive":
      return {
        title: "Ice Slice",
        description: "Conjure a stationary vortex of ice.",
        effect1:
          "Enemies are only damaged if standing on the periphery of the vortex.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityFirePassive":
      return {
        title: "Fuel to Burn",
        description: "All of your magic goes farther and lasts longer.",
        effect1: "+1 tile count modifier",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityFireActive":
      return {
        title: "Wildfire",
        description: "Fire travels in the direction of your closest enemy.",
        effect1: "Creates a single, lateral line of fire.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityWoodPassive":
      return {
        title: "Crunchy Granola",
        description: "You're extra healthy.",
        effect1: "+2 to starting lives.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityWoodActive":
      return {
        title: "Overgrowth",
        description:
          "Poison ivy travels in the direction of your closest enemy.",
        effect1: "Status remains on the tile until walked on.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityLightningPassive":
      return {
        title: "Charged Step",
        description: "Electrical energy courses through your body.",
        effect1: "+4 to move speed",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityLightningActive":
      return {
        title: "Discharge",
        description:
          "Cast 3 bolts of lightning in the direction of your closest enemy.",
        effect1: "Bolts travel forward and diagonally from point of cast.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityDeathPassive":
      return {
        title: "One Foot in the Grave",
        description: "Communing with death has brought you closer to it...",
        effect1: "-2 to starting health",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityDeathActive":
      return {
        title: "Haunt",
        description: "Shoot a ghost at your closest enemy.",
        effect1: "Ghost will follow the enemy between tiles.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityBubblePassive":
      return {
        title: "So Many Bubbles",
        description:
          "Dispelling magic has taught you how to increase the effectiveness of your own.",
        effect1: "+1 number of tiles modifier",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityBubbleActive":
      return {
        title: "Dispel",
        description: "Send out bubbles to dispel all tile effects in the area.",
        effect1: "Will clear both positive and negative tile statuses.",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
    case "healthBar":
      return {
        title: "Health Bar",
        description: "You're health bar.",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
      break;
  }
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  max-width: 460px;
  height: 300px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  text-font: 30px;
  font-alignment: 30px;
  color: black;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const Display = ({
  playerData,
  displayString,
  hoveredContent = null
}) => {
  const [_string, playerIndex] = (displayString &&
    displayString.split(" ")) || ["", 0];
  // console.log(_string, playerIndex);
  const {
    title,
    description,
    effect1,
    effect2,
    img,
    formatData
  } = (displayString &&
    getDescription(_string, playerData, Number(playerIndex))) || {
    title: "",
    description: "",
    img: "",
    formatData: {}
  };
  return (
    <Wrapper>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{effect1}</p>
      <p>{effect2}</p>
      <img src={img} />
    </Wrapper>
  );
};
