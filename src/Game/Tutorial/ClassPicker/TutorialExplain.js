import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Abilities } from "./Components/Abilities";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import { DescriptionDisplay } from "../../MainGame/UI/DescriptionDisplay";
import { PLAYER_CLASSES, PLAYER_ABILITIES } from "../../../Utils/gameState";
import { lookupClass } from "../../../Utils/utils";
import {
  Wrapper,
  TitleWrapper,
  Title,
  ButtonsWrapper,
  Button
} from "./Components/StyledComponents";
const BackgroundImage = styled.img`
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
    pickedAbilities.length === 3 && lookupClass(pickedAbilities, setPlayerData);
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
