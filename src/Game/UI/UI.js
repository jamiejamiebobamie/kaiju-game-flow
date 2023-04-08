import React, { useState } from "react";
import styled from "styled-components";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { DescriptionDisplay } from "./DescriptionDisplay";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 10px;
  /* min-width: 400px;
  width: 300px;
  height: 700px; */
  /* background-color: white; */
  align-self: center;
  margin-top: 90px;

  margin-left: -130px;
  margin-right: 30px;
  height: 350px;
  z-index: 999999999;
`;
const ButtonGroup = styled.div`
  position: absolute;
  bottom: 45px;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: red; */

  width: 442px;
  height: 50px;
  transform: scale(1, 1.3);
  /* margin-top: 25px;
  margin-bottom: 25px;
  margin-left: 50px;
  margin-right: 50px; */
  display: flex;
  flex-direction: column;
  margin-left: 30px;
`;
const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 10px;
  height: 40px;
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
`;
const Logo = styled.img`
  position: absolute;
  top: 55px;
  right: 65px;
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
  scale
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
        <Logo src="logo1.png" />
        {playerUI}
        {teammateUI}
        <ButtonGroup>
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
// <DescriptionDisplay
//   playerData={playerData}
//   displayString={displayString}
// />
