import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useInterval } from "../../Utils/utils";

const getDescription = (string, playerData, playerIndex) => {
  switch (string) {
    case "modifiers":
      return {
        title: playerIndex === 1 ? "Your teammate" : "You",
        description: "",
        img: "",
        formatData: {}
      };
      break;
    case "class":
      return {
        title:
          playerData &&
          playerData[playerIndex] &&
          playerData[playerIndex].playerClass
            ? playerIndex === 1
              ? `Class: ${playerData[playerIndex].playerClass}`
              : `Class: ${playerData[playerIndex].playerClass}`
            : "",
        description: "",
        img: "",
        formatData: {}
      };
      break;
    case "kaijuDeath":
      return {
        title: "Giant Mantis",
        description:
          "A giant, albino preying mantis with crimson eyes. Its scythes rend human souls from their flesh.",
        img: "",
        formatData: {}
      };
      break;
    case "kaijuBubble":
      return {
        title: "Blimpy",
        description: "A parade float.",
        effect: "Enchants all who see it, to their deaths!",
        img: "",
        formatData: {}
      };
      break;
    case "kaijuFire":
      return {
        title: "Not-Godzilla",
        description: "It's not Godzilla.",
        effect: "Enchants all who see it, to their deaths!",
        img: "",
        formatData: {}
      };
      break;
    case "kaijuGlass":
      return {
        title: "Not-Mothra",
        description: "A giant moth that is not Mothra.",
        effect: "Enchants all who see it, to their deaths!",
        img: "",
        formatData: {}
      };
      break;
    case "kaijuWood":
      return {
        title: "Kudzu",
        description: "A giant, ivy-covered python.",
        effect: "Enchants all who see it, to their deaths!",
        img: "",
        formatData: {}
      };
      break;
    case "kaijuLightning":
      return {
        title: "Gargantula",
        description: "A giant tarantula that attacks with lightning speed.",
        effect: "Enchants all who see it, to their deaths!",
        img: "",
        formatData: {}
      };
      break;
    case "kaijuMetal":
      return {
        title: "Mechatron",
        description: "A giant mech. Wasn't it suppoed to be on our side?",
        effect: "Enchants all who see it, to their deaths!",
        img: "",
        formatData: {}
      };
      break;
    case "abilityHeartActive":
      return {
        title: "Heal",
        description: "Heal your teammate up to maximum health.",
        effect: "Heal will follow its target between tiles.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityHeartPassive":
      return {
        title: "Good Vibes",
        description: "You send out good vibes.",
        effect: "",
        img: "",
        formatData: {}
      };
      break;
    case "abilityMetalPassive":
      return {
        title: "Aegis Armor",
        description:
          "Fashion armor out of nearby cars, street signs, and street lights.",
        effect: "TBD",
        img: "",
        formatData: {}
      };
      break;
    case "abilityMetalActive":
      return {
        title: "Aegis",
        description:
          "Create a large area of protection around you. Blocking many ranged attacks.",
        effect: "Status remains on the tile until walked on.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityGlassPassive":
      return {
        title: "Shatter Shot",
        description:
          "Shoot out street lights to curve your bullets around them.",
        effect: "TBD",
        img: "",
        formatData: {}
      };
      break;
    case "abilityGlassActive":
      return {
        title: "Teleport",
        description: "Travel instantly to your desired location.",
        effect:
          "Select a hexagon to travel to and then activate the ability to teleport.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityIcePassive":
      return {
        title: "Cold Shoulder",
        description: "Your shoulders are cold and all feel your chill.",
        effect: "TBD",
        img: "",
        formatData: {}
      };
      break;
    case "abilityIceActive":
      return {
        title: "Ice Slice",
        description: "Conjure a stationary vortex of ice",
        effect:
          "Enemies are only damaged if standing on the periphery of the vortex.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityFirePassive":
      return {
        title: "Campfire",
        description:
          "A warm glow emanates from you. A flame burns in your palm.",
        effect: "TBD",
        img: "",
        formatData: {}
      };
      break;
    case "abilityFireActive":
      return {
        title: "Brush Fire",
        description: "Fire travels in the direction of your closest enemy.",
        effect: "Creates a single, lateral line of fire.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityWoodPassive":
      return {
        title: "Crunchy Granola",
        description: "You're extra healthy.",
        effect: "+1 max lives.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityWoodActive":
      return {
        title: "Overgrowth",
        description:
          "Poison ivy travels in the direction of your closest enemy.",
        effect: "Status remains on the tile until walked on.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityLightningPassive":
      return {
        title: "Charged Step",
        description: "Electrical energy courses through your body.",
        effect: "+7 to move speed.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityLightningActive":
      return {
        title: "Discharge",
        description:
          "Cast 3 bolts of lightning in the direction of your closest enemy.",
        effect: "Bolts travel forward and diagonally from point of cast.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityDeathPassive":
      return {
        title: "Reaper",
        description: "Harvest any souls trying to pass on.",
        effect: "Gain an extra life every time your opponent dies.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityDeathActive":
      return {
        title: "Haunt",
        description: "Shoot a ghost at your closest enemy.",
        effect: "Ghost will follow your enemy between tiles.",
        img: "",
        formatData: {}
      };
      break;
    case "abilityBubblePassive":
      return {
        title: "Shelter",
        description: "A giant bubble surrounds you.",
        effect: "TBD",
        img: "",
        formatData: {}
      };
      break;
    case "abilityBubbleActive":
      return {
        title: "Dispel",
        description: "Send out bubbles to dispel all tile effects in the area.",
        effect: "Will clear both positive and negative tile statuses.",
        img: "",
        formatData: {}
      };
      break;
    case "healthBar":
      return {
        title: "Life",
        description: "You're healthbar.",
        effect: "If your life reaches 0, it's gameover.",
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
  const { title, description, effect, img, formatData } = (displayString &&
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
      <p>{effect}</p>
      <img src={img} />
    </Wrapper>
  );
};
