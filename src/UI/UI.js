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
export const UI = ({ playerData, setPlayerData, setTileStatuses, scale }) => {
  const [displayString, setDisplayString] = useState(null);
  return (
    <Wrapper>
      <Player
        playerData={playerData[0]}
        setPlayerData={setPlayerData}
        setTileStatuses={setTileStatuses}
        scale={scale}
        setDisplayString={setDisplayString}
      />
      <Display displayString={displayString} />
      <Player
        playerData={playerData[1]}
        setPlayerData={setPlayerData}
        setTileStatuses={setTileStatuses}
        scale={scale}
        setDisplayString={setDisplayString}
        isReversed={true}
      />
    </Wrapper>
  );
};
