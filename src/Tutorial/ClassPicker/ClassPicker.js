import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Abilities } from "./Components/Abilities";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import { DescriptionDisplay } from "../../Game/UI/DescriptionDisplay";
import { PLAYER_CLASSES, PLAYER_ABILITIES } from "../../Utils/gameState";
import {
  Wrapper,
  TitleWrapper,
  ButtonsWrapper,
  Button
} from "./Components/StyledComponents";
import { lookupClassAndOrSetPassives } from "../../Utils/utils";

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

  ${props =>
    props.animName &&
    `-webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-name: ${props.animName};
    animation-name:  ${props.animName};`}

  @keyframes fadeInLeft {
    0% {
      opacity: 0;
      transform: translateX(-20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInRight {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
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
  &:hover {
    border-bottom: 3px solid;
    transform: translate(0px, 3px);
  }
  font-size: 20px;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
const ClassTitlePopUp = styled.div`
  /* position: absolute;
  display: flex;
  flex-direction: column;
  align-self: center;
  font-alignment: center;
  align-content: center; */
  position: absolute;
  display: flex;
  flex-direction: column;

  text-align: center;
  /* font-alignment: center;
  align-self: center;
  align-content: center; */

  justify-content: center;
  pointer-events: none;
  /* left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  width: 700px;  */
  /* background-color: green; */
  left: 50%;
  top: 45%;

  width: 900px;
  height: 200px;
  margin-left: -450px;
  margin-top: -150px;

  z-index: 9999999999;
  opacity: 0;
  font-size: 50px;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
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
  animName,
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
    console.log(pickedAbilities);
  }, [pickedAbilities]);
  useEffect(() => {
    if (classTitle) setTimeout(() => setClassTitle(null), 3000);
  }, [classTitle]);
  return (
    <ClassPickerWrapper animName={animName}>
      {classTitle && <ClassTitlePopUp>You are a {classTitle}</ClassTitlePopUp>}
      <AbilityButtonsWrapper>
        <br />
        <Title>Choose your abilities</Title>
        <br />
        <Title>{`Pick ${numAbilitiesToPick}:`}</Title>
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
        />
        <PlayButton onClick={handeClickPlay}>Play!</PlayButton>
      </DescriptionDisplayWrapper>
    </ClassPickerWrapper>
  );
};
