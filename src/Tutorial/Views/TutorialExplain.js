import React, { useEffect } from "react";
import styled from "styled-components";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import { lookupClassAndOrSetPassives } from "../../Utils/utils";
import {
  Wrapper,
  TitleWrapper,
  Title,
  ButtonsWrapper,
  Button
} from "./Components/StyledComponents";
const BackgroundImage = styled.img`
  border-radius: 5px;
  border-style: solid;
  border-thickness: thick;
  border-color: #64939b;
  margin-top: -170px;
  width: 478px;
  height: 800px;
  transform: scale(0.6);
  background-repeat: no-repeat;
`;
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
        <BackgroundImage src={"test_map.png"} />
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
      <ButtonsWrapper>
        <Button onClick={backButtonCallback}>{backButtonContent}</Button>
        <Button onClick={() => incrementTutorialViewIndex()}>
          {nextButtonContent}
        </Button>
      </ButtonsWrapper>
    </Wrapper>
  );
};
