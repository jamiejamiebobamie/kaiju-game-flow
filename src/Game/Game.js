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
  determineKaijuQuantity,
  getTileOffsetFromDir,
  isTileOnGameBoard,
  findPath,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles
} from "Utils/utils";
import { FullscreenPage } from "Components/FullscreenPage.js";
import { HolographGridBackground } from "Game/UI/HolographGridBackground";

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
  overflow: visible;
`;

export const FloatingEffect = styled.div`

  ${props => !!props.styles && props.styles}

  animation: float-animation ${props => !!props.duration ? props.duration : "4"}s ease-in-out infinite;

@keyframes float-animation {
  0%, 100% {
    transform: translateY(0);
  }
  12.5% {
    transform: translateY(-2px);
  }
  25% {
    transform: translateY(-5px);
  }
  37.5% {
    transform: translateY(-3px);
  }
  50% {
    transform: translateY(-6px);
  }
  62.5% {
    transform: translateY(-4px);
  }
  75% {
    transform: translateY(-5px);
  }
  87.5% {
    transform: translateY(-2px);
  }
}`;

const GameBoardOverlay = styled.div`
  position: absolute;
  z-index: ${props => props.isBackground ? 214 : 2147483643};

  pointer-events: none;
  background: url(${props => props.isBackground ? "GameUI_Pieces/GameArea_Background.png" : "GameUI_Pieces/GameArea_Overlay.png"});
  transform: ${props => props.isBackground ? "scale(0.78, 0.84) translate(537px, 620px)" : "scale(.78, .83) translate(-193px, -117px)"};
  
  width: ${props => props.isBackground ? "387px" : "1117px"};
  height: ${props => props.isBackground ? "46px" : "919px"};

  ${props => !props.isBackground && "filter: drop-shadow(0px 5px 5px black);"}
`;

const ProgressCounterOverlay = styled.div`
  position: absolute;
  z-index: ${props => props.isBackground ? 214 : 2147483645};

  pointer-events: none;
  background: url(GameUI_Pieces/ScoreArea_Overlay.png);
    background: url(${props => props.isBackground ? "GameUI_Pieces/ScoreArea_Background.png" : "GameUI_Pieces/ScoreArea_Overlay.png"});
  transform: scale(1.3, 1) translate(397px, 32px);
  width: 255px;
  height: 109px;
  ${props => props.isBackground && "filter: brightness(0.5) drop-shadow(0px 20px 15px black) hue-rotate(275deg);"}
`;

const Avatar_Overlay = styled.div`
  position: absolute;
  z-index: ${props => props.isBackground ? 2147483644 : 2147483645};

  pointer-events: none;
  background: url(${props => props.isTeammate ?
    props.isBackground ? 'GameUI_Pieces/TeammateArea_Background.png' : 'GameUI_Pieces/TeammateArea_Overlay.png'
    : props.isBackground ? 'GameUI_Pieces/PlayerArea_Background.png' : 'GameUI_Pieces/PlayerArea_Overlay.png'});
  transform: ${props => props.isTeammate ? 'scale(0.8, 0.785) translate(572.5px, 434px)' : 'scale(0.79, 0.78) translate(442px, 190.5px)'};
  width: ${props => props.isTeammate ? '355px' : '483px'};
  height: ${props => props.isTeammate ? '162px' : '215px'};

  ${props => props.isBackground && (props.isTeammate ? "filter: brightness(0.5) drop-shadow(-2px 2px 10px black) hue-rotate(275deg);" : "filter: brightness(0.5) drop-shadow(-4px 10px 10px black) hue-rotate(275deg);")}
`;

const RiseUpEffect = styled.div`
  position: absolute;
  z-index: 2147483645; 
  transform: scale(0.7) translate(328px, 107px);
  filter: drop-shadow(-2px 2px 10px black);

  animation: rise-up-animation ${props => props.duration}s linear forwards 1;
  animation-delay: ${props => props.delay}s;
  @keyframes rise-up-animation{
    0% {
      transform: scale(0.7) translate(328px, 107px);
      filter: drop-shadow(-2px 2px 10px black);
    }

  60% {
      transform: scale(0.8) translate(214px, 85px);
      filter: drop-shadow(black -4px 10px 6px);
    }

  100% {
      transform: scale(1) translate(0px, 0px);
      filter: drop-shadow(black -4px 7px 30px);
    }
  }

  ${props => !!props.styles && props.styles}
`;

const RotateInPlaceEffect = styled.div`
  position: absolute;
  z-index: 2147483645; 
  // transform: scale(0.7) translate(328px, 107px);
  // filter: drop-shadow(-2px 2px 10px black);

  animation: rotate-in-place-animation ${props => props.duration}s linear forwards 1;
  animation-delay: ${props => props.delay ? props.delay : 0}s;
  @keyframes rotate-in-place-animation{
    0% {
        transform: scale(-1, 1);
    }

    100% {
        transform: scale(1, 1);
    }
  }

  ${props => !!props.styles && props.styles}
`;




const SwoopOutEffect = styled.div`
  position: absolute;
  ${props => !!props.styles && props.styles}
  animation: swoop-out-animation  ${props => props.duration}s ease-out forwards 1;

@keyframes swoop-out-animation{
0% {
    z-index: -84;
    transform: translate(-400px, 0px);
}

99% {
    z-index: -84;
    transform: translate(0px, 0px);
}
100% {
    z-index: 2147483646;
    transform: translate(0px, 0px);
}
}`;


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

  const TURN_DELAY = 110;//75;//50;

  // 100%, "normal size":
  const SCALE = 0.3;
  const WIDTH = 500;
  const HEIGHT = 800;
  // - - - - - - - - - - -
  const percentZoom = 90 / 100;
  const scale = SCALE * percentZoom;
  const width = WIDTH * percentZoom;
  const height = HEIGHT * percentZoom;

  const [isPaused, setIsPaused] = useState(false);

  // units = tiles
  const ROW_OFFSET = 0;//isPaused ? 5 : 0;
  const ROW_LENGTH = 36;//(isPaused ? 15 : 36) - ROW_OFFSET;

  const COL_OFFSET = 0;//isPaused ? 3 : 0;
  const COL_LENGTH = 24;//(isPaused ? 20 : 24) - COL_OFFSET;
  // - - - - - - -


  const accTime = useRef(0);
  const [isTeammate, setIsTeammate] = useState(true);
  const [pickedAbilities, setPickedAbilities] = useState([]);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [winner, setWinner] = useState(null);
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
  const isEndKeyPress = useRef(true);
  const pressedKeys = useRef([]);


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

    let tile;
    setPlayerData(data => {
      if (Array.isArray(data) && !!data.length) {
        tile = data[0].tile;
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


  useKeyPress({ keyCodes: "Escape", keyUpCallback: handleClickPause, isCharacterDead: false });

  const keyDown = code => {

    pressedKeys.current = !pressedKeys.current.includes(code) ? [...pressedKeys.current, code] : pressedKeys.current;

    // if (isEndKeyPress.current) {
    //   setKeysPressed(keys => {
    //     const newKeys = !keys.includes(code) ? [...keys, code] : keys; // add key
    //     moveWASD(newKeys);
    //     return newKeys;
    //   });
    //   isEndKeyPress.current = false;
    // }
  }

  const keyUp = code => {

    pressedKeys.current = pressedKeys.current.includes(code) ? pressedKeys.current.filter(k => k != code) : pressedKeys.current; // remove key

    // if (!isEndKeyPress.current) {
    //   setKeysPressed(keys => {
    //     isEndKeyPress.current = false;
    //     const newKeys = keys.includes(code) ? keys.filter(k => k != code) : keys; // remove key
    //     moveWASD(newKeys);
    //     return newKeys;
    //   });
    // }
  }

  useKeyPress({
    keyCodes: ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"],
    keyDownCallback: keyDown,
    keyUpCallback: keyUp,
    isCharacterDead: isPlayerDead
  });

  useEffect(() => {
    if (kaijuKillCount.length >= MAX_TO_WIN) {
      const _winner = 0;
      setWinner(_winner);
    }

    if (!!playerData.length && playerKillCount >= playerData.length) {
      setWinner(-1);
    }

    if (!!playerData.length && !!playerData[0] && playerData[0].isDead) {
      setIsPlayerDead(true);
      // setKeysPressed([]);
      pressedKeys.current = [];
      setHighlightedTiles0([]);
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

  const resetHightlightedTiles = () => {
    setHoverLookupString('');
    setHighlightedTiles0([]);
    setPath([]);
  }

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
  });

  // pieces event tick
  useInterval(() => {
    const teleportTile = !!highlightedTiles0 && !!highlightedTiles0.length && !!teleportData && teleportData.includes(0) ? highlightedTiles0[highlightedTiles0.length - 1] : {};
    updateTileState({
      playerData,
      kaijuData,
      setDmgArray,
      setTileStatuses,
      scale,
      accTime: accTime.current,
      teleportTile: { i: teleportTile.h_i, j: teleportTile.h_j }
    });
    redrawTiles({
      highlightedTiles0,
      setClickedTile,
      setTiles,
      playerData,
      kaijuData,
      tileStatuses,
      setTileStatuses,
      scale,
      rowLength: ROW_LENGTH,
      colLength: COL_LENGTH,
      rowOffset: ROW_OFFSET,
      colOffset: COL_OFFSET,
      isMap: true,//isRenderCityMap,
      isRenderTiles: !isPaused
    });
  }, intervalTime + 50);

    // pieces event tick
  useInterval(() => {
    !!pressedKeys.current.length && moveWASD(pressedKeys.current);
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
      resetHightlightedTiles
    );
    const gameTime = accTime.current;
    if (gameTime > 3000) // delay Kaiju spawning at start
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
        difficulty: selectedDifficulty,
        TURN_DELAY
      });
    // update accumulated time.
    accTime.current =
      accTime.current > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  }, intervalTime);

  const swoopOutDuration = 3; //testing

  return !isPlayingGame ? <AbilityPicker
    handleClickHome={handleClickHome}
    pickedAbilities={pickedAbilities}
    setPickedAbilities={setPickedAbilities}
    handleClickPlay={() => {
      setWinner(1);
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
          <GameBoardOverlay isBackground={true} />
          <HolographGridBackground isVisible={true} />
          <HolographGridBackground isVisible={isPaused} isLeftSide={true} />
          <SwoopOutEffect duration={swoopOutDuration}>
            <FloatingEffect>
              {/* <RotateInPlaceEffect duration={swoopOutDuration}> */}
              <ProgressCounterOverlay />
              <ProgressCounterOverlay isBackground={true} />
              {/* </RotateInPlaceEffect> */}
            </FloatingEffect>
          </SwoopOutEffect>
          {isTeammate ?
            <SwoopOutEffect duration={swoopOutDuration}>
              <FloatingEffect
                styles={`display: flex; flex-direction: column; animation-delay: 3s;`}
                duration={"5"}>
                <Avatar_Overlay isTeammate={isTeammate} />
                <Avatar_Overlay isTeammate={isTeammate} isBackground={true} />
              </FloatingEffect>
            </SwoopOutEffect>
            : null}
          <SwoopOutEffect duration={swoopOutDuration}>
            <RiseUpEffect duration={1} delay={swoopOutDuration}>
              <FloatingEffect
                styles={`display: flex; flex-direction: column; animation-delay: 2s;`}
                duration={"5.5"}>
                <Avatar_Overlay isTeammate={false} />
                <Avatar_Overlay isTeammate={false} isBackground={true} />
              </FloatingEffect>
            </RiseUpEffect>
          </SwoopOutEffect>
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
              //
              highlightedTiles0={highlightedTiles0}
              setHighlightedTiles0={setHighlightedTiles0}
              setPath={setPath}
              setDmgArray={setDmgArray}
              setTiles={setTiles}
              accTime={accTime}
              GAME_PIECES_TURN_DELAY={TURN_DELAY}
              ROW_LENGTH={ROW_LENGTH}
              COL_LENGTH={COL_LENGTH}
              ROW_OFFSET={ROW_OFFSET}
              COL_OFFSET={COL_OFFSET}
              initializationProps={{
                playerData,
                setPlayerData,
                pickedAbilities,
                kaijuData,
                width,
                height,
                scale,
                setTiles,
                setClickedTile,
                tileStatuses,
                setTileStatuses,
                isTeammate,
                selectedAvatar,
                ROW_LENGTH,
                COL_LENGTH,
                ROW_OFFSET,
                COL_OFFSET
              }}
              teleportData={teleportData}
            />
            < UI
              playerData={playerData}
              setPlayerData={setPlayerData}
              kaijuKillCount={kaijuKillCount}
              kaijuKilledToWin={MAX_TO_WIN}
              kaijuData={kaijuData}
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
              accTime={accTime.current}
            />
          </GameWrapper>
        </Wrapper>);
};
