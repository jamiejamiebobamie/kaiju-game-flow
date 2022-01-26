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
  initializeGameBoard
} from "../Utils/utils";
const GameWrapper = styled.div`
  position: relative;
  margin-top: 100px;
  display: flex;
  justify-content: space-between;
  width: 1200px;
`;
const ButtonsWrapper = styled.div`
  position: absolute;
  display: flex;
  bottom: 75px;
  justify-content: space-around;
  width: 100%;
  height: 100px;
`;
const Button = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;

  min-width: 180px;
  height: 60px;

  font-alignment: center;
  text-align: center;

  cursor: pointer;

  border-radius: 5px;
  border-style: solid;
  border-thickness: thin;
  border-bottom: 5px solid;
  border-color: #64939b;
  color: #64939b;
  &:hover {
    border-bottom: 3px solid;
    transform: translate(0px, 3px);
  }
  font-size: 17px;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
const ReplayTitle = styled.div`
  color: #64939b;
`;
const ReplayModal = styled.div`
  position: absolute;
  z-index: 9999999999;

  display: flex;
  flex-direction: column;
  justify-content: center;

  align-content: center;
  align-self: center;
  align-items: center;

  width: 750px;
  height: 550px;
  min-width: 750px;
  min-height: 550px;

  left: 250px;

  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  border-color: #64939b;

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
    props.fontSize ? `font-size:${props.fontSize}px;` : "font-size:25px;"}
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const Game = ({ pickedAbilities, handleClickHome, handleClickGame }) => {
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
  useKeyPress(
    code => {
      switch (code) {
        case "Escape":
          setIsPaused(_isPaused => !_isPaused);
          setIntervalTime(_intervalTime => (_intervalTime === null ? 1 : null));
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
      setTileStatuses
    );
  }, []);
  useEffect(() => {
    if (kaijuKillCount.length >= 7) {
      const _winner = 0;
      // playerData[0].lives && !playerData[1].lives
      //   ? 0
      //   : kaijuKillCount.filter(k => k === 0).length >
      //     kaijuKillCount.filter(k => k === 1).length
      //   ? 0
      //   : 1;
      setWinner(_winner);
    }
    if (playerKillCount > 1) setWinner(-1);
  }, [kaijuKillCount, playerKillCount]);
  useEffect(() => {
    if (playerMoveToTiles !== null) {
      setPlayerData(_playerData =>
        _playerData.map((p, i) =>
          i === 0 ? { ...p, moveToTiles: playerMoveToTiles } : p
        )
      );
      setPlayerMoveToTiles(null);
    }
  }, [playerMoveToTiles]);
  // useEffect(() => {
  //   if (teleportData.length) setHighlightedTiles0([]);
  //   // setPath
  // }, [teleportData]);

  useEffect(() => {
    if (winner !== null && !replayModalMessage) {
      if (!kaijuData.find(kaiju => kaiju.lives > 0) || winner === -1) {
        let message = "You won?";
        switch (winner) {
          // case 0:
          //   message = [
          //     <ReplayTitle fontSize={35}>You saved the city!</ReplayTitle>,
          //     <br />,
          //     <br />,
          //     <ReplayTitle>Play again?</ReplayTitle>
          //   ];
          //   break;
          // case 1:
          //   message = [
          //     <ReplayTitle fontSize={35}>
          //       Your teammate saved the city!
          //     </ReplayTitle>,
          //     <br />,
          //     <br />,
          //     <ReplayTitle>Play again?</ReplayTitle>
          //   ];
          //   break;
          case 0:
            message = [
              <ReplayTitle fontSize={35}>
                Your team saved the city!
              </ReplayTitle>,
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
    // if (!replayModalMessage && !isPaused) {
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
    // console.log(accTime.current);
    // update accumulated time.
    accTime.current =
      accTime > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
    // }
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
              height: "150px",
              minHeight: "150px",
              marginTop: "-115px"
            }}
          >
            {replayModalMessage}
          </div>
          <ButtonsWrapper>
            <Button onClick={handleClickHome}>No Thanks</Button>
            <Button onClick={handleClickGame}>Play Again</Button>
          </ButtonsWrapper>
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
        scale={scale}
      />
    </GameWrapper>
  );
};
