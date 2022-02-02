import React from "react";
import styled from "styled-components";

const getDescription = (string, playerData, playerIndex) => {
  switch (string) {
    case "modifiers":
      return playerData && playerData[playerIndex]
        ? {
            title: playerIndex === 1 ? "Your teammate" : "You",
            description: [
              <div>
                Move Speed:{" "}
                <span
                  style={{
                    color:
                      playerData[playerIndex].moveSpeed > 6
                        ? "green"
                        : playerData[playerIndex].moveSpeed < 6
                        ? "red"
                        : "black"
                  }}
                >
                  {playerData[playerIndex].moveSpeed}
                </span>
              </div>,
              <br />,
              <div>
                Lives:{" "}
                <span
                  style={{
                    color:
                      playerData[playerIndex].lives > 4
                        ? "green"
                        : playerData[playerIndex].lives < 4
                        ? "red"
                        : "black"
                  }}
                >
                  {playerData[playerIndex].lives}
                </span>
              </div>,
              <br />,
              <div>
                Num Tiles Modifier:{" "}
                <span
                  style={{
                    color:
                      playerData[playerIndex].numTilesModifier > 0
                        ? "green"
                        : "black"
                  }}
                >
                  {playerData[playerIndex].numTilesModifier}
                </span>
              </div>,
              <br />,
              <div>
                Tiles Count Modifier:{" "}
                <span
                  style={{
                    color:
                      playerData[playerIndex].tileCountModifier > 0
                        ? "green"
                        : "black"
                  }}
                >
                  {playerData[playerIndex].tileCountModifier}
                </span>
              </div>
            ],
            effect1: "",
            effect2: "",
            img: "",
            formatData: {}
          }
        : {
            title: "",
            description: "",
            effect1: "",
            effect2: "",
            img: "",
            formatData: {}
          };
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
        effect1:
          playerData &&
          playerData[playerIndex] &&
          playerData[playerIndex].elements &&
          playerData[playerIndex].elements,
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityHeartActive":
      return {
        title: "Heal",
        description: "Heal your teammate",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityHeartPassive":
      return {
        title: "Good Vibes",
        description: "You send out good vibes",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityMetalPassive":
      return {
        title: "Builder",
        description: "Your magic is larger, goes farther, and lasts longer",
        effect1: "+1 number of tiles modifier",
        effect2: "+1 tile count modifier",
        img: "",
        formatData: {}
      };
    case "abilityMetalActive":
      return {
        title: "Aegis",
        description:
          "Create an area of protection around you. Blocking many ranged attacks",
        effect1: "Status remains on the tile until walked on",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityGlassPassive":
      return {
        title: "Teleport Sickness",
        description: "Zipping through space-time makes you nauseous",
        effect1: "-2 to move speed",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityGlassActive":
      return {
        title: "Escape",
        description: "Instantly travel to a safe tile",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityIcePassive":
      return {
        title: "Inclement Weather",
        description: "The forecast calls for snow",
        effect1: "-1 to move speed",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityIceActive":
      return {
        title: "Ice Slice",
        description: "Conjure a stationary vortex of ice",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityFirePassive":
      return {
        title: "Fuel to Burn",
        description: "All of your magic goes farther and lasts longer",
        effect1: "+1 tile count modifier",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityFireActive":
      return {
        title: "Wildfire",
        description: "Create a single, lateral line of fire.",
        effect1: "Fire travels in the direction of your closest enemy",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityWoodPassive":
      return {
        title: "Crunchy Granola",
        description: "You're extra healthy",
        effect1: "+1 to starting lives",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityWoodActive":
      return {
        title: "Overgrowth",
        description:
          "Poison ivy travels in the direction of your closest enemy",
        effect1: "Status remains on the tile until walked on",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityLightningPassive":
      return {
        title: "Charged Step",
        description: "Electrical energy courses through your body",
        effect1: "+1 to move speed",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityLightningActive":
      return {
        title: "Discharge",
        description:
          "Cast 3 bolts of lightning in the direction of your closest enemy",
        effect1: "Bolts ricochet off the walls of the map",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityDeathPassive":
      return {
        title: "One Foot in the Grave",
        description: "Communing with death has brought you closer to it...",
        effect1: "-1 to starting health",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityDeathActive":
      return {
        title: "Haunt",
        description: "Shoot a ghost at your closest enemy",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityBubblePassive":
      return {
        title: "So Many Bubbles",
        description: "Your magic is more effective",
        effect1: "+1 number of tiles modifier",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityBubbleActive":
      return {
        title: "Dispel",
        description: "Dispel all tile effects around you",
        effect1: "Clears both positive and negative statuses",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "healthBar":
      return {
        title: "Health Bar",
        description: "Your health bar",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
    case "Kaiju":
      return {
        title: "Kaiju",
        description: "They come from the sea!",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {}
      };
  }
};
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  ${props =>
    !props.isClassWrapper &&
    "padding: 20px; border-style: solid; border-thickness: thin; max-width: 460px;"}
  width: 100%;
  height: 300px;
  border-radius: 10px;
  text-font: 30px;
  font-alignment: 30px;
  color: #db974f;
  border-color: #db974f;
`;
export const DescriptionDisplay = ({
  hoveredContent = null,
  displayString,
  playerData,
  isClassWrapper,
  pickedAbilities,
  isTutorial
}) => {
  const [_string, playerIndex] = (displayString &&
    displayString.split(" ")) || ["", 0];
  const { title, description, effect1, effect2, img } = (displayString &&
    getDescription(_string, playerData, Number(playerIndex))) ||
    (isClassWrapper &&
      pickedAbilities &&
      pickedAbilities.length === 3 &&
      getDescription("class", playerData, 0)) || {
      title: "",
      description: "",
      img: "",
      formatData: {}
    };
  return (
    <Wrapper isClassWrapper={isClassWrapper}>
      <h2>{!isTutorial && !title ? "Press ESC to pause" : title}</h2>
      <p>{description}</p>
      <p>{effect1}</p>
      <p>{effect2}</p>
      <img src={img} />
    </Wrapper>
  );
};
