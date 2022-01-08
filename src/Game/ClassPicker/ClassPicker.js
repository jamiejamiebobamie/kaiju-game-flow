import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DescriptionDisplay } from "../UI/DescriptionDisplay";
import { Abilities } from "./Components/Abilities";
import { PLAYER_CLASSES } from "../../Utils/gameState";

const ClassPickerWrapper = styled.div`
  display: flex;
  margin-top: 100px;
  width: 750px;
  height: 900px;
  min-width: 700px;
  min-height: 800px;
  flex-direction: column;
  align-self: center;
  align-items: center;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
`;
const ClassPickerGameBoard = styled.div`
  width: 100%;
  height: 450px;
`;
const AbilityButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 270px;
`;
const Title = styled.div`
  text-font: 10px;
  font-alignment: 30px;
  display: flex;
  align-self: flex-start;
  margin-left: 50px;
  align-content: center;
  color: black;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
const DescriptionDisplayWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
`;
export const ClassPicker = () => {
  const [displayString, setDisplayString] = useState(null);
  const [pickedAbilities, setPickedAbilities] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const handleChange = element => {
    console.log(element);
    if (pickedAbilities.includes(element)) {
      const _pickedAbilities = [...pickedAbilities, element]
        .filter(pickedElement => pickedElement !== element)
        .splice((a1, a2) => a1.localeCompare(a2));
      setPickedAbilities(_pickedAbilities);
    } else if (pickedAbilities.length < 3) {
      const _pickedAbilities = [...pickedAbilities, element].sort((a1, a2) =>
        a1.localeCompare(a2)
      );
      setPickedAbilities(_pickedAbilities);
    }
  };
  useEffect(() => {
    const classLookup = pickedAbilities.reduce(
      (acc, element, i) => (acc ? acc + "," + element : acc + element),
      ""
    );
    const playerClassObj = PLAYER_CLASSES.find(pc => pc.elems === classLookup);
    setPlayerData([
      {
        playerClass: playerClassObj && playerClassObj.class_name,
        playerClassDescription:
          playerClassObj && playerClassObj.player_class_description,
        elements: classLookup
      }
    ]);
    console.log(playerData, playerClassObj, classLookup, pickedAbilities);
  }, [pickedAbilities]);
  return (
    <ClassPickerWrapper>
      <AbilityButtonsWrapper>
        <Title>Pick 3:</Title>
        <Abilities
          handleChange={handleChange}
          pickedAbilities={pickedAbilities}
          setDisplayString={setDisplayString}
        />
      </AbilityButtonsWrapper>
      <ClassPickerGameBoard />
      <DescriptionDisplayWrapper>
        <DescriptionDisplay
          isClassWrapper={true}
          displayString={displayString}
          pickedAbilities={pickedAbilities}
          playerData={playerData}
        />
      </DescriptionDisplayWrapper>
    </ClassPickerWrapper>
  );
};
