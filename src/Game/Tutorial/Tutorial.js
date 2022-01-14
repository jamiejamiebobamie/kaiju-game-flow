import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { ClassPicker } from "./ClassPicker/ClassPicker";
import {
  useInterval,
  useHover,
  movePieceTutorial,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles,
  initializeTutorialGameBoard
} from "../../Utils/utils";

export const Tutorial = ({
  pickedAbilities,
  setPickedAbilities,
  handeClickPlay
}) => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const [playerData, setPlayerData] = useState([]);
  const [teleportData, setTeleportData] = useState([]);
  const [dmgArray, setDmgArray] = useState([]);
  const [kaijuData, setKaijuData] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles0, setHighlightedTiles0] = useState([]);
  const [highlightedTiles1, setHighlightedTiles1] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [setHoverRef, hoverLookupString] = useHover();
  const [path, setPath] = useState(null);
  const [intervalTime, setIntervalTime] = useState(1);
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  useEffect(() => {
    initializeTutorialGameBoard(
      playerData,
      setPlayerData,
      kaijuData,
      setKaijuData,
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
    const isTutorial = true;
    updateHighlightedTiles(
      setHighlightedTiles0,
      playerData,
      hoverLookupString,
      path,
      setPath,
      scale,
      0,
      isTutorial
    );
    if (shouldUpdate(accTime.current, 2))
      updateTileState(
        playerData,
        kaijuData,
        setDmgArray,
        setTileStatuses,
        width,
        height,
        scale,
        accTime.current,
        isTutorial
      );
    redrawTiles(
      highlightedTiles0,
      highlightedTiles1,
      setHoverRef,
      setClickedTile,
      setTiles,
      playerData,
      kaijuData,
      tileStatuses,
      setTileStatuses,
      width,
      height,
      scale,
      isTutorial
    );
    // move players
    movePieceTutorial(
      playerData,
      setPlayerData,
      () => {},
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
    movePieceTutorial(
      kaijuData,
      setKaijuData,
      undefined,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      playerData,
      dmgArray,
      undefined,
      undefined
    );
    // update accumulated time.
    accTime.current =
      accTime > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  }, intervalTime);

  return (
    <ClassPicker
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handeClickPlay={handeClickPlay}
      isPaused={false}
      powerUpData={[]}
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
  );
};
