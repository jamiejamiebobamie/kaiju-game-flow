import React, { useState } from "react";
import styled from "styled-components";
import { PlayerUI } from "./PlayerUI/PlayerUI";
import { DescriptionDisplay } from "./DescriptionDisplay";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 10px;
  min-width: 500px;
  width: 500px;
  height: 800px;
`;
export const UI = ({
  playerData,
  kaijuData,
  kaijuKillCount,
  setPlayerData,
  setTeleportData,
  setTileStatuses,
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
  const teammateUI = (
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
    />
  );
  return (
    <Wrapper>
      {playerUI}
      <DescriptionDisplay
        playerData={playerData}
        displayString={displayString}
      />
      {teammateUI}
    </Wrapper>
  );
};
