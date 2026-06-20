import React, { useState } from "react";
import styled from "styled-components";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { BlinkFadeEffect } from 'Components/AvatarSelection';
import { FloatingEffect } from 'Game/ReactComponents/Game';

const Wrapper = styled.div`
${props => props.percentZoom ? `transform: scale(${props.percentZoom}) translate(${(1 - props.percentZoom) * 200 - 2.4}px, 0px);` : ''} // -2.4 for border radius

  position: relative;
  display: flex;
  flex-direction: column;

  border-radius: 10px;
  align-self: center;
  width: 320px;
  z-index: 2147483646;
  pointer-events: none;
`;
const ButtonGroup = styled.div`
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-self: flex-start;
    width: 355px;
    transform: translate(-38.9px, 39px);
    pointer-events: auto;
`;
const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  height: 40px;
  pointer-events: auto;
`;
const Button = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  width: 150px;
  height: 50px;
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
  text-stroke: 0.5px black;
  -webkit-text-stroke: 0.5px black;
  background-color: #376e5b;
  pointer-events: auto;
  font-size: 20px;
  line-height: 34px;
`;
const ButtonOutline = styled.div`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 149.5px;
  height: 33.5px;
  margin-top: -0.5px;
  pointer-events: none;
  border-radius: 3px;
  border: 0.75px solid black;
  border-right: 0.3px solid black;
  border-left: 0.3px solid black;
  border-bottom: 0.5px solid black;
  pointer-events: auto;
`;
const ProgressCounter = styled.div`
  width: 272px;
  height: 40px;

  position: absolute;
  z-index: 2147483646;

  display: flex;
  align-self: flex-end;
  justify-content: space-between;

    margin-top: -114px;
    margin-right: 9px;


  color: #71ff71;
  -webkit-text-stroke: 0.5px #71ff71;
  -webkit-box-pack: end;

  pointer-events: none;
`;

const ProgressContent = styled.div`
  font-size: 1.5em;
`;

const FillerDiv = styled.div`
  width: 400px;
  height: 170px;
`;
export const UI = ({
  playerData,
  setPlayerData,
  kaijuData,
  kaijuKillCount,
  kaijuKilledToWin,
  setTeleportData,
  setTileStatuses,
  handleClickHome,
  handleClickPause,
  scale,
  percentZoom,
  isTeammate,
  isPaused,
  accTime
}) => {
  const [displayString, setDisplayString] = useState(null);
  const progressCounter = <ProgressCounter>
    <ProgressContent>
      <FloatingEffect>
        <BlinkFadeEffect>
          Kaiju:
        </BlinkFadeEffect>
      </FloatingEffect>
    </ProgressContent>
    <ProgressContent>
      <FloatingEffect>
        <BlinkFadeEffect>
          {`${Array.isArray(kaijuKillCount) ? kaijuKillCount.length : 0} / ${kaijuKilledToWin}`}
        </BlinkFadeEffect>
      </FloatingEffect>
    </ProgressContent>
  </ProgressCounter>
  const playerUIs = Array.isArray(playerData) && playerData.map((pd, i) => <PlayerUI
    pd={pd}
    playerData={playerData}
    setPlayerData={setPlayerData}
    kaijuData={kaijuData}
    kaijuKillCount={kaijuKillCount}
    setTeleportData={setTeleportData}
    setTileStatuses={setTileStatuses}
    scale={scale}
    setDisplayString={setDisplayString}
    playerIndex={i}
    isTeammate={i > 0}
    isPaused={isPaused}
    accTime={accTime}
  />);
  const buttons = <ButtonGroup>
    <ButtonsWrapper title={'Pause'}>
      <Button onClick={handleClickPause}>
        <ButtonOutline zIndex={1} />
        Pause
      </Button>
    </ButtonsWrapper>
    <ButtonsWrapper title={'Goodbye!'}>
      <Button onClick={handleClickHome}>
        <ButtonOutline zIndex={1} />
        Leave
      </Button>
    </ButtonsWrapper>
  </ButtonGroup>
  return (
    <Wrapper percentZoom={percentZoom}>
      {progressCounter}
      {playerUIs}
      {!isTeammate && <FillerDiv />}
      {buttons}
    </Wrapper>
  );
};
