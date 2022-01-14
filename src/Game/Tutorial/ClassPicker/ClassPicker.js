import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Abilities } from "./Components/Abilities";
import { ClassPickerGameBoard } from "./Components/ClassPickerGameBoard";
import { DescriptionDisplay } from "../../MainGame/UI/DescriptionDisplay";
import { PLAYER_CLASSES, PLAYER_ABILITIES } from "../../../Utils/gameState";
import { lookupClass } from "../../../Utils/utils";

const ClassPickerWrapper = styled.div`
  display: flex;
  margin-top: 5vh;
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
const AbilityButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 270px;
`;
const Title = styled.div`
  font-size: 20px;
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
  position: relative;
  justify-content: space-around;
  width: 100%;
  /* background-color: red; */
  /* margin-left: 100px; */
`;
const PlayButton = styled.div`
  position: absolute;
  z-index: 2;

  display: flex;
  align-content: flex-end;
  align-self: flex-end;

  min-width: 150px;
  height: 50px;
  /* margin-bottom: 20px; */
  /* margin-left: 500px; */

  right: 30px;
  bottom: 30px;

  /* right: 200px;
  margin-bottom: 20px; */
  /* bottom: 5px; */

  /* margin-right: 100px;
  margin-bottom: 5px; */

  font-alignment: center;
  text-align: center;

  cursor: pointer;

  border-radius: 5px;
  border-style: solid;
  border-thickness: thin;
  border-bottom: 4px solid;

  font-size: 20px;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const ClassPicker = ({
  pickedAbilities,
  setPickedAbilities,
  handeClickPlay,
  isPaused,
  powerUpData,
  playerData,
  setPlayerData,
  setTeleportData,
  kaijuData,
  setPlayerMoveToTiles,
  tileStatuses,
  setTileStatuses,
  clickedTile,
  setClickedTile,
  tiles,
  path,
  width,
  height,
  scale
}) => {
  const [displayString, setDisplayString] = useState(null);
  const handleChange = element => {
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
    lookupClass(pickedAbilities, setPlayerData);
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
      <ClassPickerGameBoard
        isPaused={isPaused}
        powerUpData={powerUpData}
        playerData={playerData}
        setPlayerData={setPlayerData}
        setTeleportData={setTeleportData}
        kaijuData={kaijuData}
        setPlayerMoveToTiles={setPlayerMoveToTiles}
        tileStatuses={tileStatuses}
        setTileStatuses={setTileStatuses}
        clickedTile={clickedTile}
        setClickedTile={setClickedTile}
        tiles={tiles}
        path={path}
        width={width}
        height={height}
        scale={scale}
      />
      <DescriptionDisplayWrapper>
        <DescriptionDisplay
          isClassWrapper={true}
          displayString={displayString}
          pickedAbilities={pickedAbilities}
          playerData={playerData}
        />
        <PlayButton onClick={handeClickPlay}>Play!</PlayButton>
      </DescriptionDisplayWrapper>
    </ClassPickerWrapper>
  );
};
