import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import {
  useInterval,
  useKeyPress,
  useHover,
  movePlayerPieces,
  moveKaijuPieces,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles,
  initializeGameBoard,
  areTilesAdjacent,
  getAdjacentTiles
} from "../Utils/utils";
import {
  ButtonsWrapper,
  Button,
  ButtonGroup,
  ButtonOutline,
  BackgroundImage
} from "../Tutorial/Views/Components/StyledComponents";
const GameWrapper = styled.div`
  position: relative;
  display: flex;
  align-self: center;
  justify-content: space-between;
  /* width: auto; */
  width: 800px;
  height: 100%;

  /* background-color: purple; */
  margin-top: 40px;
  /* border-style: solid;
  border-thickness: thin;
  border-radius: 10px; */
  /* background-color: #152642; */
  /* border-color: #db974f; */
  overflow: hidden;
  /* box-shadow: 3px 7px 10px black; */
`;
const ReplayTitle = styled.div`
  display: flex;
  align-self: center;
  text-alignment: center;
  text-align: center;
  font-alignment: center;
  color: #db974f;
`;
const ReplayModal = styled.div`
  position: absolute;
  z-index: 9999999999;

  padding: 50px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  align-self: center;
  align-items: center;

  margin-left: 15%;

  width: 550px;
  height: 350px;

  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-color: #db974f;

  background-color: #152642;

  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    10% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  ${props =>
    props.fontSize ? `font-size:${props.fontSize}px;` : "font-size:25px;"};
`;
export const Game = ({
  pickedAbilities,
  handleClickHome,
  handleClickGame,
  isMale,
  isTeammate
}) => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const [winner, setWinner] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [dmgArray, setDmgArray] = useState([]);
  const [kaijuKillCount, setKaijuKillCount] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [teleportData, setTeleportData] = useState([]);
  const [playerKillCount, setPlayerKillCount] = useState(0);
  const [kaijuData, setKaijuData] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles0, setHighlightedTiles0] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [setHoverRef, hoverLookupString] = useHover();
  const [path, setPath] = useState(null);
  const [intervalTime, setIntervalTime] = useState(1);
  const [replayModalMessage, setReplayModalMessage] = useState(null);
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  const handleClickPause = () => {
    setIsPaused(_isPaused => !_isPaused);
    setIntervalTime(_intervalTime => (_intervalTime === null ? 1 : null));
  };
  useKeyPress(
    code => {
      switch (code) {
        case "Escape":
          handleClickPause();
          break;
      }
    },
    ["Escape"]
  );
  useEffect(() => {
    initializeGameBoard(
      playerData,
      setPlayerData,
      pickedAbilities,
      kaijuData,
      width,
      height,
      scale,
      setTiles,
      setClickedTile,
      setHoverRef,
      tileStatuses,
      setTileStatuses,
      isTeammate
    );
  }, []);
  useEffect(() => {
    if (kaijuKillCount.length >= 5) {
      const _winner = 0;
      setWinner(_winner);
    }
    console.log(playerData, playerKillCount);
    if (playerData.length && playerKillCount >= playerData.length)
      setWinner(-1); // BUG!
  }, [kaijuKillCount, playerKillCount]);
  useEffect(() => {
    if (playerMoveToTiles !== null) {
      const adjTilesToPath = playerMoveToTiles[0] && [
        playerMoveToTiles[0],
        ...getAdjacentTiles(playerMoveToTiles[0])
      ];
      setPlayerData(_playerData =>
        _playerData.map((p, i) => {
          if (i === 0) {
            const adjTilesToPlayer = p.tile && [
              p.tile,
              ...getAdjacentTiles(p.tile)
            ];
            const shouldSet =
              adjTilesToPlayer &&
              adjTilesToPath &&
              adjTilesToPlayer.some(t =>
                adjTilesToPath.some(_t => _t.i === t.i && _t.j === t.j)
              );
            return {
              ...p,
              moveToTiles: shouldSet ? playerMoveToTiles : p.moveToTiles
            };
          } else {
            return p;
          }
        })
      );
    }
    setPlayerMoveToTiles(null);
  }, [playerMoveToTiles]);
  useEffect(() => {
    if (winner !== null && !replayModalMessage) {
      if (!kaijuData.find(kaiju => kaiju.lives > 0) || winner === -1) {
        let message = "You won?";
        switch (winner) {
          case 0:
            message = [
              <ReplayTitle fontSize={35}>You saved the city!</ReplayTitle>,
              <br />,
              <br />,
              <ReplayTitle>Play again?</ReplayTitle>
            ];
            break;
          case -1:
            message = [
              <ReplayTitle fontSize={35}>You died</ReplayTitle>,
              <br />,
              <br />,
              <ReplayTitle>Play again?</ReplayTitle>
            ];
            break;
        }
        setReplayModalMessage(message);
        setIntervalTime(null);
      }
    }
  }, [kaijuData, winner]);
  useInterval(() => {
    updateHighlightedTiles(
      setHighlightedTiles0,
      playerData,
      hoverLookupString,
      path,
      setPath,
      scale,
      0
    );
    if (shouldUpdate(accTime.current, 3))
      updateTileState(
        playerData,
        kaijuData,
        setDmgArray,
        setTileStatuses,
        width,
        height,
        scale,
        accTime.current
      );
    redrawTiles(
      highlightedTiles0,
      setHoverRef,
      setClickedTile,
      setTiles,
      playerData,
      kaijuData,
      tileStatuses,
      setTileStatuses,
      width,
      height,
      scale
    );
    // move players
    movePlayerPieces(
      playerData,
      setPlayerData,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      kaijuData,
      dmgArray,
      setPlayerKillCount,
      teleportData,
      setTeleportData,
      false,
      winner,
      playerKillCount
    );
    // move monsters
    moveKaijuPieces(
      kaijuData,
      setKaijuData,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      playerData,
      dmgArray,
      setKaijuKillCount,
      false,
      winner
    );
    // update accumulated time.
    accTime.current =
      accTime > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  }, intervalTime);
  return (
    <GameWrapper>
      {replayModalMessage && (
        <ReplayModal>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "50px"
            }}
          >
            {replayModalMessage}
          </div>
          <ButtonGroup>
            <ButtonsWrapper>
              <Button onClick={handleClickHome}>
                <ButtonOutline zIndex={1} />
                No Thanks
              </Button>
            </ButtonsWrapper>
            <ButtonsWrapper>
              <Button onClick={handleClickGame}>
                <ButtonOutline zIndex={1} />
                Play Again
              </Button>
            </ButtonsWrapper>
          </ButtonGroup>
        </ReplayModal>
      )}
      <GameBoard
        isPaused={isPaused}
        playerData={playerData}
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
      <UI
        playerData={playerData}
        kaijuKillCount={kaijuKillCount}
        kaijuData={kaijuData}
        setPlayerData={setPlayerData}
        setTeleportData={setTeleportData}
        setTileStatuses={setTileStatuses}
        handleClickHome={handleClickHome}
        handleClickPause={handleClickPause}
        scale={scale}
      />
    </GameWrapper>
  );
};
