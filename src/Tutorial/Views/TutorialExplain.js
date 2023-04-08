import React, { useEffect } from "react";
import styled from "styled-components";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import { GameMap } from "../../Components/GameMap.js";

// import { lookupClassAndOrSetPassives } from "../../Utils/utils";
import {
  Wrapper,
  TitleWrapper,
  Title,
  ButtonsWrapper,
  Button,
  ButtonGroup,
  ButtonOutline,
  BackgroundImage
} from "./Components/StyledComponents";
export const TutorialExplain = ({
  title,
  title2,
  shiftContentOver,
  showCity,
  backButtonContent,
  nextButtonContent,
  backButtonCallback,
  nextButtonCallback,
  pickedAbilities,
  setPickedAbilities,
  incrementTutorialViewIndex,
  decrementTutorialViewIndex,
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
  const borderStyles = `
    position:relative;
    width:245px;
    height:395px;
    background-repeat: no-repeat;
    margin-bottom: 30px;
    border-radius: 5px;
    border-style: solid;
    border-thickness: thick;
    border-color: #db974f;
    box-shadow: 3px 7px 10px black;
    overflow:hidden;
    `;
  const mapStyles = `transform:scale(.5) translate(-125px);`;
  // useEffect(() => {
  //   pickedAbilities && lookupClassAndOrSetPassives(pickedAbilities, setPlayerData);
  // }, [pickedAbilities]);
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{title}</Title>
      </TitleWrapper>
      {showCity ? (
        <GameMap borderStyles={borderStyles} mapStyles={mapStyles} />
      ) : (
        <TutorialGameBoard
          shiftContentOver={shiftContentOver}
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
      )}
      {title2 && (
        <TitleWrapper>
          <Title>{title2}</Title>
        </TitleWrapper>
      )}
      <ButtonGroup>
        <ButtonsWrapper>
          <Button onClick={backButtonCallback}>
            <ButtonOutline zIndex={1} />
            {backButtonContent}
          </Button>
        </ButtonsWrapper>
        <ButtonsWrapper>
          <Button onClick={() => incrementTutorialViewIndex()}>
            <ButtonOutline zIndex={1} />
            {nextButtonContent}
          </Button>
        </ButtonsWrapper>
      </ButtonGroup>
    </Wrapper>
  );
};
// <BackgroundImage src={"mapPic.png"} width={300} />
