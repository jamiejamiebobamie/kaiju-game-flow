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
  determineKaijuQuantity,
  getTileOffsetFromDir,
  isTileOnGameBoard,
  findPath
} from "Utils/utils";
import { FullscreenPage } from "Components/FullscreenPage.js";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-self: center;
`;

const GameWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  ${props => props.width ? `width: ${props.width};` : "width:800px;"}
  ${props => props.height ? `height: ${props.height};` : "height:800px;"}
  overflow: hidden;
`;

const GameBoardOverlay = styled.div`
  position: absolute;
  z-index: ${props => props.isBackground ? 214 : 2147483645};

  pointer-events: none;
  background: url(${props => props.isBackground ? "GameUI_Pieces/GameArea_Background.png" : "GameUI_Pieces/GameArea_Overlay.png"});
  transform: ${props => props.isBackground ? "scale(0.78, 0.83) translate(537px, 626px)" : "scale(.78, .83) translate(-193px, -117px)"};
  
  width: ${props => props.isBackground ? "387px" : "1117px"};
  height: ${props => props.isBackground ? "46px" : "919px"};
`;

const ProgressCounterOverlay = styled.div`
  position: absolute;
  z-index: ${props => props.isBackground ? 214 : 2147483648};

  pointer-events: none;
  background: url(GameUI_Pieces/ScoreArea_Overlay.png);
    background: url(${props => props.isBackground ? "GameUI_Pieces/ScoreArea_Background.png" : "GameUI_Pieces/ScoreArea_Overlay.png"});
  transform: scale(1.3, 1) translate(398px, 32px);
  width: 255px;
  height: 109px;
`;

const UI_Overlay = styled.div`
  position: absolute;
  z-index: ${props => props.isBackground ? 2147483646 : 2147483647};

  pointer-events: none;
  background: url(${props => props.isTeammate ?
    props.isBackground ? 'GameUI_Pieces/TeammateArea_Background.png' : 'GameUI_Pieces/TeammateArea_Overlay.png'
    : props.isBackground ? 'GameUI_Pieces/PlayerArea_Background.png' : 'GameUI_Pieces/PlayerArea_Overlay.png'});
  transform: ${props => props.isTeammate ? 'scale(0.8, .785) translate(573px, 419px)' : 'scale(0.79, .78) translate(442px, 190.5px)'};
  width: ${props => props.isTeammate ? '355px' : '483px'};
  height: ${props => props.isTeammate ? '162px' : '215px'};
`;

const shouldUpdate = (accTime, interval) => !(accTime % interval);

export const Game = ({ handleClickHome, triggerTransition }) => {
  const DEFAULT_FULLSCREEN_PAGE_DATA = {
    text: ["Wild Kaiju have appeared!"],
    buttons: [
      {
        text: "Fight!",
        onClick: () => {
          setWinner(null);
          setIntervalTime(TURN_DELAY);
          setFullScreenPageData(undefined);
        }
      }
    ],
    image: { src: './story_images/match_start.png', width: '535px', height: '535px' }
  }
  const { selectedAvatar, selectedDifficulty } = useContext(GlobalSettingsContext);

  const { MAX_TO_WIN } = determineKaijuQuantity(selectedDifficulty);

  const TURN_DELAY = 100;

  // 100%, "normal size":
  const SCALE = 0.3;
  const WIDTH = 500;
  const HEIGHT = 800;
  // - - - - - - - - - - -
  const percentZoom = 90 / 100;
  const scale = SCALE * percentZoom;
  const width = WIDTH * percentZoom;
  const height = HEIGHT * percentZoom;

  const accTime = useRef(0);
  const teammatePowersRaceConditionFix = useRef({}); // teammate is shooting powers twice due to React update logic (updating with "setTileStatuses" in shootPower)
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
  const [fullScreenPageData, setFullScreenPageData] = useState(DEFAULT_FULLSCREEN_PAGE_DATA);
  const [isPlayerDead, setIsPlayerDead] = useState(false);
  const [keysPressed, setKeysPressed] = useState([]);

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
    setFullScreenPageData(DEFAULT_FULLSCREEN_PAGE_DATA);
    setDeadKaijuLocations([]);
  };
  const handleClickPause = () => {
    setIsPaused(_isPaused => !_isPaused);
    setIntervalTime(_intervalTime => (_intervalTime === null ? TURN_DELAY : null));
  };

  const moveWASD = keys => {
    const sortLookup = {
      "KeyW": 0, "KeyS": 1, "KeyA": 2, "KeyD": 3,
      "ArrowUp": 0, "ArrowDown": 1, "ArrowLeft": 2, "ArrowRight": 3
    };

    const dirLookup = {
      "KeyW": "up", "KeyA": "left", "KeyS": "down", "KeyD": "right",
      "ArrowUp": "up", "ArrowLeft": "left", "ArrowDown": "down", "ArrowRight": "right"
    };

    const dirs = keys
      // sort based on priority
      .sort((a, b) => sortLookup[a] - sortLookup[b])
      // map keys to directions
      .map(k => dirLookup[k])
      // remove duplicates in case of Arrow Keys and WASD are pressed at same time
      .reduce((acc, item) => !acc.includes(item) ? [...acc, item] : acc, []);

    let dir = dirs[0];
    if (dirs.length > 1) {
      const isConflictingDirs = (dirs.includes("up") && dirs.includes("down")) || (dirs.includes("left") && dirs.includes("right"));
      if (isConflictingDirs) {
        dir = dirs[0];
      } else {
        dir = `${dirs[0]} ${dirs[1]}`;
      }
    }

    console.log({ keys, dirs, dir });
    let tile;
    setPlayerData(data => {
      console.log({ playerData: data })
      if (Array.isArray(data) && !!data.length) {
        tile = data[0].tile;
        console.log({ tile });
        if (!!tile) {
          if (dir == "right" || dir == "left") {
            /*
              handle left-right movement on hexagonal grid.
              prefix "up " or "down " depending on
                column index of current player tile.
            */
            const { j } = tile;
            if (j % 2) {
              dir = `up ${dir}`;
            } else {
              dir = `down ${dir}`;
            }
          }
          const desiredOffset = getTileOffsetFromDir(dir, tile);
          const nextTile = { i: tile.i + desiredOffset.i, j: tile.j + desiredOffset.j };
          const isValid = isTileOnGameBoard(nextTile);

          console.log({ desiredOffset, nextTile, isValid });
          if (isValid) {
            const path = findPath(
              tile,
              nextTile,
              scale
            );
            setPlayerMoveToTiles(path);
            setHoverLookupString(`${nextTile.i} ${nextTile.j}`);
          }
        }
      }
      return data
    });
  }

  useKeyPress({ keyCodes: "Escape", keyUpCallback: handleClickPause, isPlayerDead: false });

  const keyDown = code => {
    setKeysPressed(keys => {
      const newKeys = !keys.includes(code) ? [...keys, code] : keys; // add key
      // console.log("keyDown", { newKeys });
      moveWASD(newKeys);
      return newKeys;
    });
  }

  const keyUp = code => {
    setKeysPressed(keys => {
      const newKeys = keys.includes(code) ? keys.filter(k => k != code) : keys; // remove key
      // console.log("keyUp", { newKeys });
      !!newKeys.length && moveWASD(newKeys);
      return newKeys;
    });
  }

  useKeyPress({
    keyCodes: ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"],
    keyDownCallback: keyDown,
    keyUpCallback: keyUp,
    isPlayerDead
  });

  useEffect(() => {
    if (kaijuKillCount.length >= MAX_TO_WIN) {
      const _winner = 0;
      setWinner(_winner);
    }
    if (!!playerData.length && playerKillCount >= playerData.length) {
      setWinner(-1);
      if (!!playerData.length && !!playerData[0] && !playerData[0].lives) {
        setIsPlayerDead(true);
        setKeysPressed([]);
        setHighlightedTiles0([]);
      }
    }
  }, [kaijuKillCount, playerKillCount, MAX_TO_WIN]);

  useEffect(() => {
    if (playerMoveToTiles !== null) {
      setPlayerData(_playerData =>
        _playerData.map((p, i) => {
          if (i === 0) {
            return {
              ...p,
              moveToTiles: playerMoveToTiles
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
      switch (winner) {
        case 1:
          text = ["Wild Kaiju have appeared!"];
          buttons = [
            {
              text: "Fight!",
              onClick: () => {
                setWinner(null);
                setIntervalTime(TURN_DELAY);
                setFullScreenPageData(undefined);
              }
            }
          ];
          image = { src: './story_images/match_start.png', width: '535px', height: '535px' };
          break;
        case 0:
          text = ["You saved the city!", "Play again ?"];
          buttons = [{ text: "Yes", onClick: () => triggerTransition(() => resetState()) }, { text: "No", onClick: handleClickHome }];
          image = { src: './story_images/match_won.png', width: '535px', height: '535px' };
          break;
        case -1:
          text = ["You lost...", "Play again ?"];
          buttons = [{ text: "Yes", onClick: () => triggerTransition(() => resetState()) }, { text: "No", onClick: handleClickHome }];
          image = { src: './story_images/match_lost.png', width: '535px', height: '535px' };
          break;
      }
      if (!!buttons) {
        setTimeout(() => setFullScreenPageData({ text, buttons, image }), 2000);
        setIntervalTime(null);
      } else {
        setFullScreenPageData(undefined);
      }
    }
  }, [kaijuData, winner, isPlayingGame]);

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
    if (shouldUpdate(accTime.current, 3)) {
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
      setHoverRef: () => { },
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
      teammatePowersRaceConditionFix
    );
    // move monsters
    moveKaijuPieces({
      data: kaijuData,
      setData: setKaijuData,
      tileStatuses,
      setTileStatuses,
      scale: scale,
      accTime: accTime.current,
      enemyData: playerData,
      setEnemyData: setPlayerData,
      dmgArray: dmgArray,
      kaijuKillCount,
      setKaijuKillCount,
      isTutorial: false,
      winner: winner,
      setDeadKaijuLocations,
      difficulty: selectedDifficulty
    });
    // update accumulated time.
    accTime.current =
      accTime.current > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  }, intervalTime);

  return !isPlayingGame ? <AbilityPicker
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
        setHoverRef: () => { },
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
    : fullScreenPageData ?
      <FullscreenPage
        text={fullScreenPageData.text}
        buttons={fullScreenPageData.buttons}
        image={fullScreenPageData.image}
        homeButtonOnClick={fullScreenPageData.homeButtonOnClick}
      />
      : (
        <Wrapper>
          <GameBoardOverlay />
          <ProgressCounterOverlay />
          <UI_Overlay isTeammate={true} />
          <UI_Overlay isTeammate={false} />
          <GameBoardOverlay isBackground={true} />
          <ProgressCounterOverlay isBackground={true} />
          <UI_Overlay isTeammate={true} isBackground={true} />
          <UI_Overlay isTeammate={false} isBackground={true} />
          <GameWrapper width={width} height={height}>
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
              width={width}
              height={height}
              scale={scale}
              percentZoom={percentZoom}
              isTeammate={isTeammate}
              isPaused={isPaused}
            />
          </GameWrapper>
        </Wrapper>);
};
