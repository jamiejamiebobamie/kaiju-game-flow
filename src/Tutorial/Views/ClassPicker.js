import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Abilities } from "./Components/Abilities";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import { DescriptionDisplay } from "../../Game/UI/DescriptionDisplay";
import { lookupClassAndOrSetPassives } from "../../Utils/utils";

const ClassPickerWrapper = styled.div`
  display: flex;
  /* margin-top: -10px; */
  width: 750px;
  min-width: 700px;
  height: 900px;
  min-height: 900px;
  flex-direction: column;
  align-self: center;
  align-items: center;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  border-color: #6b948e;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    10% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
const AbilityButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
`;
const Title = styled.div`
  font-size: 20px;
  font-alignment: 30px;
  display: flex;
  align-self: flex-start;
  margin-left: 50px;
  align-content: center;
  color: #6b948e;
`;
const DescriptionDisplayWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: space-around;
  width: 100%;
  margin-top: -30px;
`;
const PlayButton = styled.div`
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: flex-end;
  align-self: flex-end;

  min-width: 150px;
  height: 50px;

  right: 30px;
  bottom: 30px;

  font-alignment: center;
  text-align: center;

  cursor: pointer;

  border-radius: 5px;
  border-style: solid;
  border-thickness: thin;
  border-bottom: 5px solid;
  border-color: #64939b;
  color: #64939b;

  &:hover {
    border-bottom: 3px solid;
    transform: translate(0px, 3px);
  }
  font-size: 20px;
`;
const ClassTitlePopUp = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  pointer-events: none;
  left: 50%;
  top: 45%;
  width: 900px;
  height: 200px;
  margin-left: -450px;
  margin-top: -150px;
  color: #779b64;
  z-index: 9999999999;
  opacity: 0;
  font-size: 50px;
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-name: fadeInFadeOutUp;
  animation-name: fadeInRight;
  @keyframes fadeInRight {
    0% {
      opacity: 0;
      transform: translateY(0px);
    }
    50% {
      opacity: 1;
      transform: translateY(20px);
    }
    70% {
      opacity: 1;
      transform: translateY(20px);
    }
    100% {
      opacity: 0;
      transform: translateY(0px);
    }
  }
`;
export const ClassPicker = ({
  pickedAbilities,
  setPickedAbilities,
  handleClickPlay,
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
  scale,
  numAbilitiesToPick
}) => {
  const [displayString, setDisplayString] = useState(null);
  const [classTitle, setClassTitle] = useState("");
  const handleChange = element => {
    if (pickedAbilities.includes(element)) {
      const _pickedAbilities = [...pickedAbilities, element]
        .filter(pickedElement => pickedElement !== element)
        .splice((a1, a2) => a1.localeCompare(a2));
      setPickedAbilities(_pickedAbilities);
    } else if (pickedAbilities.length < numAbilitiesToPick) {
      const _pickedAbilities = [...pickedAbilities, element].sort((a1, a2) =>
        a1.localeCompare(a2)
      );
      setPickedAbilities(_pickedAbilities);
    }
  };
  useEffect(() => {
    lookupClassAndOrSetPassives(pickedAbilities, setPlayerData, setClassTitle);
  }, [pickedAbilities]);
  useEffect(() => {
    if (classTitle) setTimeout(() => setClassTitle(null), 3000);
  }, [classTitle]);
  return (
    <ClassPickerWrapper>
      {classTitle && <ClassTitlePopUp>You are a {classTitle}</ClassTitlePopUp>}
      <AbilityButtonsWrapper>
        <div style={{ height: "75px" }}>
          <br />
          <Title>Choose your abilities</Title>
          <Title>{`Pick ${numAbilitiesToPick}:`}</Title>
        </div>
        <Abilities
          handleChange={handleChange}
          pickedAbilities={pickedAbilities}
          setDisplayString={setDisplayString}
        />
      </AbilityButtonsWrapper>
      <TutorialGameBoard
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
          isTutorial={true}
        />
        <PlayButton onClick={handleClickPlay}>Play!</PlayButton>
      </DescriptionDisplayWrapper>
    </ClassPickerWrapper>
  );
};
