import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useInterval } from "../Utils/utils";

const DESCRIPTION_LOOKUP = {
  kaijuDeath: {
    title: "Giant Mantis",
    description: "A giant, albino preying mantis with crimson eyes.",
    effect:
      "Gain an extra life for any player that dies in proximity to the Kaiju.",
    img: "",
    formatData: {}
  },
  kaijuBubble: {
    title: "Parade Float",
    description: "A parade float.",
    effect: "Spread joy.",
    img: "",
    formatData: {}
  },
  kaijuFire: {
    title: "Not-Godzilla",
    description: "It's not Godzilla.",
    effect: "Dragon's Breath is more effective.",
    img: "",
    formatData: {}
  },
  kaijuGlass: {
    title: "Mothra",
    description: "A giant moth.",
    effect: "Reduced cooldown for Shatter Shot and Shatter Travel abilities.",
    img: "",
    formatData: {}
  },
  kaijuWood: {
    title: "Kudzu",
    description: "A giant, ivy-covered python.",
    effect: "Kaiju spreads ivy in its wake.",
    img: "",
    formatData: {}
  },
  kaijuLightning: {
    title: "Gargantula",
    description: "A giant tarantula.",
    effect: "Reduced cooldown for Charged Step and Discharge.",
    img: "",
    formatData: {}
  },
  kaijuMetal: {
    title: "Mechatron",
    description: "A giant mech.",
    effect: "Reduced cooldown for Aegis Armor and Aegis.",
    img: "",
    formatData: {}
  },
  //
  abilityMetalPassive: {
    title: "Aegis Armor",
    description:
      "Fashion armor out of nearby cars, street signs, and street lights.",
    effect: "Immunity to bullets.",
    img: "",
    formatData: {}
  },
  abilityMetalActive: {
    title: "Aegis",
    description: "Create a large shield from your armor.",
    effect: "All attacks from a single direction are blocked.",
    img: "",
    formatData: {}
  },
  abilityGlassPassive: {
    title: "Shatter Shot",
    description: "Shoot out street lights to curve your bullets around them.",
    effect: "Your bullets curve around barriers to reach their target.",
    img: "",
    formatData: {}
  },
  abilityGlassActive: {
    title: "Shatter Travel",
    description: "Follow the trajectory of your bullet.",
    effect: "Travel directly to your destination at an increased speed.",
    img: "",
    formatData: {}
  },
  abilityFirePassive: {
    title: "Campfire",
    description: "A warm glow emanates from you. A flame burns in your palm.",
    effect: "Any wraith in proximity to you is destroyed.",
    img: "",
    formatData: {}
  },
  abilityFireActive: {
    title: "Dragon's Breath",
    description: "Fire shoots from your palm.",
    effect: "Cast fire in an arc at your enemy.",
    img: "",
    formatData: {}
  },
  abilityWoodPassive: {
    title: "Barkskin",
    description: "You're covered in ivy.",
    effect: "Immunity to melee weapons and invisibility on ivy tiles.",
    img: "",
    formatData: {}
  },
  abilityWoodActive: {
    title: "Overgrowth",
    description: "The ivy on your body shoots forward off of you.",
    effect: "Cast ivy in an arc at your enemy.",
    img: "",
    formatData: {}
  },
  abilityLightningPassive: {
    title: "Charged Step",
    description: "Electrical energy courses through your body.",
    effect: "Move at an increased speed.",
    img: "",
    formatData: {}
  },
  abilityLightningActive: {
    title: "Discharge",
    description: "Discharge all of the energy in your body.",
    effect: "Cast lightning in a straight line at your enemy.",
    img: "",
    formatData: {}
  },
  abilityDeathPassive: {
    title: "Reaper",
    description: "Harvest any souls trying to pass on.",
    effect: "Gain an extra life every time your opponent dies.",
    img: "",
    formatData: {}
  },
  abilityDeathActive: {
    title: "Haunt",
    description: "Send out all of the harvested souls to hunt your enemy.",
    effect: "Shoot a wraith at your enemy for every extra life you have.",
    img: "",
    formatData: {}
  },
  abilityBubblePassive: {
    title: "Shelter",
    description: "A giant bubble surrounds you.",
    effect: "Immunity to ivy and fire.",
    img: "",
    formatData: {}
  },
  abilityBubbleActive: {
    title: "Dispel",
    description: "The giant bubble you wear slides off you and rushes forward.",
    effect:
      "Send out a bubble in a straight line that dispells all tile effects.",
    img: "",
    formatData: {}
  },
  //
  Cigarette: {
    title: "Cigarette",
    description: "A lit cigarette.",
    effect: "Dragon's Breath is more effective.",

    img: "",
    formatData: {}
  },
  Unicorn: {
    title: "Unicorn",
    description: "A magical unicorn.",
    effect: "Increased movement speed until you die.",
    img: "",
    formatData: {}
  },
  CoolJacket: {
    title: "Cool Jacket",
    description: "Just a really cool jacket.",
    effect: "More kisses.",
    img: "",
    formatData: {}
  },
  MetalBat: {
    title: "Metal Bat",
    description: "A metal baseball bat.",
    effect: 'Gain new ability: "Hit".',
    // In game: a melee weapon. Headshots
    //               with it are lethal, but here it just confers a damage modifer.
    //               The bat is further modified (in game and here) with the
    //               addition of the Wood, Fire, and/or Lightning Kaiju.
    //               Wood: The bat becomes "Shillelagh" and casts Wood's active on
    //                     hit. The bat is covered in ivy.
    //               Fire: The bat becomes "Firebrand" and casts Fire's active on
    //                     hit. The bat is glowing, orange metal.
    //               Lightning: The bat becomes "Lightning Rod" and casts
    //                     Lightning's active on hit. The bat is electrified,
    //                     crackling with live electricity.
    //               These modifiers allow the bat to hit wraiths.`
    img: "",
    formatData: {}
  },
  WingedNikes: {
    title: "Winged Nikes",
    description: "Nikes with cloth wings sewed onto the heels.",
    effect: "Slightly increased movement speed if player owns Lightning Kaiju.",
    img: "",
    formatData: {}
  },
  Fertilizer: {
    title: "Fertilizer",
    description: "A large bag of fertilizer. ",
    effect: "Overgrowth is more effective.",
    img: "",
    formatData: {}
  },
  SkullRing: {
    title: "Skull Ring",
    description: "A cool ring for a rockstar or pirate.",
    effect: "Small chance of conferring one wraith on respawn.",
    img: "",
    formatData: {}
  },
  Shotgun: {
    title: "Shotgun",
    description: "A shotgun.",
    effect: 'Gives the player an extra ability: "Shoot".',
    img: "",
    formatData: {}
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
export const Display = ({ displayString, hoveredContent = null }) => {
  const { title, description, effect, img, formatData } = (displayString &&
    DESCRIPTION_LOOKUP[displayString]) || {
    title: "",
    description: "",
    img: "",
    formatData: {}
  };
  // for viewing
  // const [index, setIndex] = useState(0);
  // const [arr, setArr] = useState([]);
  // const [_display, _setDisplay] = useState({
  //   title: "",
  //   description: "",
  //   effect: "",
  //   img: "",
  //   formatData: {}
  // });
  // useEffect(() => {
  //   setArr(Object.values(DESCRIPTION_LOOKUP));
  // }, []);
  // useInterval(() => {
  //   _setDisplay(arr[index]);
  //   setIndex(index === arr.length - 1 ? 0 : index + 1);
  // }, 4000);
  // const { title, description, effect, img, formatData } = _display;
  return (
    <Wrapper>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{effect}</p>
      <img src={img} />
    </Wrapper>
  );
};
