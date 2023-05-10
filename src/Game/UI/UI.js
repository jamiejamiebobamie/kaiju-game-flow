import React, { useState } from "react";
import styled from "styled-components";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { DescriptionDisplay } from "./DescriptionDisplay";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 10px;
  align-self: center;
  margin-left: -130px;
  margin-right: 30px;
  height: 450px;
  z-index: 9999999;
  // background-color: white;
  pointer-events: none;
`;
const ButtonGroup = styled.div`
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;

  width: 442px;
  ${props => (props.isTeammate ? "height: 50px;" : "height: 100px;")}
  transform: scale(1, 1.3);
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  pointer-events: auto;
`;
const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 10px;
  height: 40px;
  pointer-events: auto;
`;
const Button = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  width: 175px;
  min-width: 175px;
  height: 20px;
  font-alignment: center;
  cursor: pointer;
  border-radius: 5px;
  border-style: solid;
  border: 3px solid #5a8a7a;
  border-bottom: 5px solid #5a8a7a;
  color: #5a8a7a;
  filter: drop-shadow(0px 3px 1px black);
  &:hover {
    border-bottom: 3px solid #5a8a7a;
    transform: translate(0px, 3px);
    filter: drop-shadow(0px 0px 0px black);
  }
  font-size: 16px;
  text-stroke: 0.5px black;
  -webkit-text-stroke: 0.5px black;
  background-color: #376e5b;
  pointer-events: auto;
`;
const ButtonOutline = styled.div`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 175px;
  min-width: 175px;
  height: 19.5px;
  margin-top: -0.5px;
  pointer-events: none;
  border-radius: 3px;
  border: 0.75px solid black;
  border-right: 0.3px solid black;
  border-left: 0.3px solid black;
  border-bottom: 0.5px solid black;
  pointer-events: auto;
`;
export const UI = ({
  playerData,
  kaijuData,
  kaijuKillCount,
  setPlayerData,
  setTeleportData,
  setTileStatuses,
  handleClickHome,
  handleClickPause,
  scale,
  isTeammate
}) => {
  const [displayString, setDisplayString] = useState(null);
  const playerUI = (
    <PlayerUI
      playerData={playerData}
      kaijuData={kaijuData}
      kaijuKillCount={kaijuKillCount}
      setPlayerData={setPlayerData}
      setTeleportData={setTeleportData}
      setTileStatuses={setTileStatuses}
      scale={scale}
      setDisplayString={setDisplayString}
      playerIndex={0}
    />
  );
  const teammateUI = playerData.length > 1 && (
    <PlayerUI
      playerData={playerData}
      kaijuData={kaijuData}
      kaijuKillCount={kaijuKillCount}
      setPlayerData={setPlayerData}
      setTeleportData={setTeleportData}
      setTileStatuses={setTileStatuses}
      scale={scale}
      setDisplayString={setDisplayString}
      isReversed={true}
      playerIndex={1}
      isTeammate={true}
    />
  );
  return (
    <Wrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "400px",
          alignSelf: "flex-end"
        }}
      >
        {playerUI}
        {teammateUI}
        <ButtonGroup isTeammate={isTeammate}>
          <div>
            <ButtonsWrapper>
              <Button onClick={handleClickPause}>
                <ButtonOutline zIndex={1} />
                Pause
              </Button>
            </ButtonsWrapper>
          </div>
          <div>
            <ButtonsWrapper>
              <Button onClick={handleClickHome}>
                <ButtonOutline zIndex={1} />
                Home
              </Button>
            </ButtonsWrapper>
          </div>
        </ButtonGroup>
      </div>
    </Wrapper>
  );
};
