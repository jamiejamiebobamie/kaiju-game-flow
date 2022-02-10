import React, { useEffect } from "react";
import styled from "styled-components";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import { lookupClassAndOrSetPassives } from "../../Utils/utils";
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
  useEffect(() => {
    lookupClassAndOrSetPassives(pickedAbilities, setPlayerData);
  }, [pickedAbilities]);
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{title}</Title>
      </TitleWrapper>
      {showCity ? (
        <BackgroundImage src={"mapPic.png"} width={300} />
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
