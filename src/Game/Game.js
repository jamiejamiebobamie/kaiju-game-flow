import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import {
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES,
  PLAYER_ABILITIES,
  PLAYER_CLASSES
} from "../Utils/gameState";
import {
  getCharXAndY,
  getRandomIntInRange,
  useInterval,
  useKeyPress,
  useHover,
  movePiece,
  respawnPlayers,
  spawnKaiju,
  spawnPowerUp,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles,
  initializeGameBoard
} from "../Utils/utils";
import "../App.css";
const GameWrapper = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: space-between;
  width: 1200px;
`;
const GameTitle = styled.div`
  display: flex;
  margin-top: 40px;
  margin-left: 40px;
  margin-bottom: -50px;
  color: black;
  font-family: data;
  font-size: 40px;
  @font-face {
    font-family: data;
    src: url(Datalegreya-Dot.otf);
  }
`;
export const Game = () => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const [winner, setWinner] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [dmgArray, setDmgArray] = useState([]);
  const [kaijuKillCount, setKaijuKillCount] = useState([]);
  const [intervalTime, setIntervalTime] = useState(100);
  const accTime = useRef(0);
  const [playerData, setPlayerData] = useState([]);
  const [teleportData, setTeleportData] = useState([]);
  const [powerUpData, setPowerUpData] = useState([]);
  const [kaijuData, setKaijuData] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [setHoverRef, hoverLookupString] = useHover();
  const [path, setPath] = useState(null);
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  useKeyPress(
    code => {
      switch (code) {
        case "Escape":
          setIsPaused(_isPaused => !_isPaused);
          setIntervalTime(_intervalTime =>
            _intervalTime === null ? 100 : null
          );
          break;
      }
    },
    ["Escape"]
  );
  useEffect(() => {
    initializeGameBoard(
      playerData,
      setPlayerData,
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
      if (
        kaijuKillCount.filter(k => k == 0).length >= 7 ||
        kaijuKillCount.filter(k => k == 1).length >= 7
      ) {
        const _winner =
          kaijuKillCount.filter(k => k == 0).length >
          kaijuKillCount.filter(k => k == 1).length
            ? 0
            : 1;
        setWinner(_winner);
      }
    }
  }, [kaijuKillCount]);
  useEffect(() => {
    if (winner) {
      setIntervalTime(null);
    }
  }, [winner]);
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
  useInterval(() => {
    // move players
    movePiece(
      playerData,
      setPlayerData,
      powerUpData,
      setPowerUpData,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      kaijuData,
      dmgArray,
      teleportData,
      setTeleportData
    );
    // move monsters
    movePiece(
      kaijuData,
      setKaijuData,
      undefined,
      undefined,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      playerData,
      dmgArray,
      undefined,
      undefined,
      setKaijuKillCount
    );
    // powerup spawning.
    if (shouldUpdate(accTime.current, 30000))
      spawnPowerUp(powerUpData, setPowerUpData, playerData, scale);
    updateHighlightedTiles(
      setHighlightedTiles,
      playerData,
      hoverLookupString,
      path,
      setPath,
      scale
    );
    if (shouldUpdate(accTime.current, 400))
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
    if (shouldUpdate(accTime.current, 300))
      redrawTiles(
        highlightedTiles,
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
    accTime.current =
      accTime > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  }, intervalTime);
  // <GameTitle>Kaiju City</GameTitle>
  return (
    <>
      <GameWrapper>
        <GameBoard
          isPaused={isPaused}
          powerUpData={powerUpData}
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
    </>
  );
};
