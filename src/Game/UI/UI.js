import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Player } from "./Player/Player";
import { Display } from "./Display";

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
  return (
    <Wrapper>
      <Player
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
      <Display playerData={playerData} displayString={displayString} />
      <Player
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
    </Wrapper>
  );
};
