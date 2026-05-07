import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { GlobalSettingsContext } from "Home";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import { AbilityPicker } from "./AbilityPicker";
import {
  useInterval,
  useKeyPress,
  movePlayerPieces,
  moveKaijuPieces,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles,
  initializeGameBoard,
  getAdjacentTiles,
  determineKaijuQuantity
} from "Utils/utils";
import { FullscreenPage } from "Components/FullscreenPage.js";
const GameWrapper = styled.div`
  position: relative;
  display: flex;
  align-self: center;
  justify-content: space-between;
  width: 800px;
  height: 100%;
  margin-top: 40px;
  overflow: hidden;
`;
export const Game = ({ handleClickHome, triggerTransition }) => {
  const { selectedAvatar, selectedDifficulty } = useContext(GlobalSettingsContext);

  const { MAX_AT_ONCE, MAX_TO_WIN } = determineKaijuQuantity(selectedDifficulty);

  const TURN_DELAY = 100;
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const [isTeammate, setIsTeammate] = useState(true);
  const [pickedAbilities, setPickedAbilities] = useState([]);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
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
  const [hoverLookupString, setHoverLookupString] = useState('');
  const [path, setPath] = useState(null);
  const [intervalTime, setIntervalTime] = useState(null);
  const [deadKaijuLocations, setDeadKaijuLocations] = useState([]);
  const [fullScreenPageData, setFullScreenPageData] = useState(undefined);

  const resetState = () => {
    setPickedAbilities([]);
    setIsPlayingGame(false);
    setWinner(null);
    setIsPaused(false);
    setDmgArray([]);
    setKaijuKillCount([]);
    setPlayerData([]);
    setTeleportData([]);
    setPlayerKillCount(0);
    setKaijuData([]);
    setClickedTile({ i: -1, j: -1 });
    setHighlightedTiles0([]);
    setTiles([]);
    setPlayerMoveToTiles(null);
    setTileStatuses(null);
    setPath(null);
    setIntervalTime(null);
    setFullScreenPageData(undefined);
    setDeadKaijuLocations([]);
  };
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  const handleClickPause = () => {
    setIsPaused(_isPaused => !_isPaused);
    setIntervalTime(_intervalTime => (_intervalTime === null ? TURN_DELAY : null));
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
    if (kaijuKillCount.length >= MAX_TO_WIN) {
      const _winner = 0;
      setWinner(_winner);
    }
    if (playerData.length && playerKillCount >= playerData.length)
      setWinner(-1);
  }, [kaijuKillCount, playerKillCount, MAX_TO_WIN]);
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
    if (winner !== null && !fullScreenPageData) {
      let text, buttons, image = undefined;

      if (!kaijuData.find(kaiju => kaiju.lives > 0) || winner === -1) {
        switch (winner) {
          case 1:
            text = ["Wild Kaiju have appeared!"];
            buttons = [
              { text:"Fight!",
                onClick: () => {
                    setWinner(null);
                    setIntervalTime(TURN_DELAY);
                    setFullScreenPageData(undefined);
                  }
              }
            ];
            image = {src: './story_images/match_start.png', width: '535px', height: '535px'};
            break;
          case 0:
            text = ["You saved the city!", "Play again ?"];
            buttons = [{text:"Yes", onClick: () => triggerTransition(() => resetState())}, {text:"No", onClick: handleClickHome}];
            image = {src: './story_images/match_won.png', width: '535px', height: '535px'};
            break;
          case -1:
            text = ["You lost...", "Play again ?"];
            buttons = [{text:"Yes", onClick: () => triggerTransition(() => resetState())}, {text:"No", onClick: handleClickHome}];
            image = {src: './story_images/match_lost.png', width: '535px', height: '535px'};
            break;
        }
        if(!!buttons){
          setTimeout(() => setFullScreenPageData({ text, buttons, image }), 2000);
          setIntervalTime(null);
        } else { 
          setFullScreenPageData(undefined);
        }
      }
    }
  }, [kaijuData, winner]);

  // event tick
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
    if (shouldUpdate(accTime.current, 3)){
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
    }
    redrawTiles({
      highlightedTiles0,
      setHoverRef: () => {},
      setClickedTile,
      setTiles,
      playerData,
      kaijuData,
      tileStatuses,
      setTileStatuses,
      scale,
  });
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
    moveKaijuPieces({
      data: kaijuData,
      setData: setKaijuData,
      tileStatuses: tileStatuses,
      setTileStatuses: setTileStatuses,
      scale: scale,
      accTime: accTime.current,
      enemyData: playerData,
      setEnemyData: setPlayerData,
      dmgArray: dmgArray,
      setKaijuKillCount: setKaijuKillCount,
      isTutorial: false,
      winner: winner,
      setDeadKaijuLocations: setDeadKaijuLocations,
      difficulty: selectedDifficulty
  });
    // update accumulated time.
    accTime.current =
      accTime.current > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  }, intervalTime);
  return !isPlayingGame ? (
    <AbilityPicker
      handleClickHome={handleClickHome}
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handleClickPlay={() => {
        setWinner(1);
        initializeGameBoard({
          playerData,
          setPlayerData,
          pickedAbilities,
          kaijuData,
          width,
          height,
          scale,
          setTiles,
          setClickedTile,
          setHoverRef: () => {},
          tileStatuses,
          setTileStatuses,
          isTeammate,
          selectedAvatar
      });
        triggerTransition(() => setIsPlayingGame(bool => !bool));
      }}
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
      numAbilitiesToPick={3}
      isTeammate={isTeammate}
      setIsTeammate={setIsTeammate}
    />
  ) : (
    <>
      {fullScreenPageData &&
        <FullscreenPage
          text={fullScreenPageData.text}
          buttons={fullScreenPageData.buttons}
          image={fullScreenPageData.image}
          homeButtonOnClick={fullScreenPageData.homeButtonOnClick}
          />}
      <GameWrapper>
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
          hoverLookupString={hoverLookupString}
          setHoverLookupString={setHoverLookupString}
          deadKaijuLocations={deadKaijuLocations}
        />
        <UI
          playerData={playerData}
          kaijuKillCount={kaijuKillCount}
          kaijuKilledToWin={MAX_TO_WIN}
          kaijuData={kaijuData}
          setPlayerData={setPlayerData}
          setTeleportData={setTeleportData}
          setTileStatuses={setTileStatuses}
          handleClickHome={handleClickHome}
          handleClickPause={handleClickPause}
          scale={scale}
          isTeammate={isTeammate}
        />
    </GameWrapper>
    </>
  );
};
