import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import { AbilityPicker } from "./AbilityPicker";
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
} from "Utils/utils";
import {
  ButtonsWrapper,
  Button,
  ButtonGroup,
  ButtonOutline,
  BackgroundImage
} from "Tutorial/Components/StyledComponents";
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
const ReplayTitle = styled.div`
  display: flex;
  align-self: center;
  text-alignment: center;
  text-align: center;
  font-alignment: center;
  margin: 5px;
  color: #db974f;
  ${props =>
    props.fontSize !== undefined &&
    `font-size: ${props.fontSize}px !important;`}
`;
const ReplayModal = styled.div`
  position: absolute;
  z-index: 999999999;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  align-items: center;
  align-content: center;
  margin-left: 5dvw;
  margin-top: -5dvw;
  width: 550px;
  height: 550px;
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
const ModalMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  line-height: 40px;
`;
const StyledImg = styled.img`
  // margin-bottom: 5px;
  border-radius: 5px;
  border-style: solid;
  border-thickness: thick;
  border-color: #db974f;
  box-shadow: 3px 7px 10px black;
`;
export const Game = ({ handleClickHome, triggerTransition }) => {
  const TOTAL_KAIJU_SPAWNED = 7;
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const [isTeammate, setIsTeammate] = useState(false);
  const [isHoveringOnGameBoard, setIsHoveringOnGameBoard] = useState(false);
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
  const [replayModalMessage, setReplayModalMessage] = useState(null);
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
    setReplayModalMessage(null);
  };
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
    if (kaijuKillCount.length >= TOTAL_KAIJU_SPAWNED) {
      const _winner = 0;
      setWinner(_winner);
    }
    if (playerData.length && playerKillCount >= playerData.length)
      setWinner(-1);
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
          case 1:
            message = [
              <ReplayTitle fontSize={22}>
                Evil Kaiju have appeared!
              </ReplayTitle>,
              <br />,
              <StyledImg src="./start.png" width="250px" height="250px" />
            ];
            break;
          case 0:
            message = [
              <ReplayTitle fontSize={25}>You saved the city!</ReplayTitle>,
              <br />,
              <StyledImg src="./you_won.png" width="250px" height="250px" />,
              <br />,
              <ReplayTitle>Play again ?</ReplayTitle>
            ];
            break;
          case -1:
            message = [
              <ReplayTitle fontSize={25}>You lost...</ReplayTitle>,
              <br />,
              <StyledImg src="./you_lost.png" width="250px" height="250px" />,
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
      () => {},
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
  return !isPlayingGame ? (
    <AbilityPicker
      handleClickHome={handleClickHome}
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handleClickPlay={() => {
        setWinner(1);
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
          () => {},
          tileStatuses,
          setTileStatuses,
          isTeammate
        );
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
    <GameWrapper>
      {replayModalMessage && (
        <ReplayModal
        // onClick={() => {
        //   setWinner(winner => (winner === 1 ? -1 : winner + 1));
        //   setReplayModalMessage(null);
        // }}
        >
          <ModalMessage
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "50px",
              lineHeight: "40px"
            }}
          >
            {replayModalMessage}
          </ModalMessage>
          <ButtonGroup>
            {winner === 1 ? (
              <ButtonsWrapper>
                <Button
                  onClick={() => {
                    setWinner(null);
                    setReplayModalMessage(null);
                    setIntervalTime(1);
                  }}
                >
                  <ButtonOutline zIndex={1} />
                  Fight!
                </Button>
              </ButtonsWrapper>
            ) : (
              <>
                <ButtonsWrapper>
                  <Button onClick={handleClickHome}>
                    <ButtonOutline zIndex={1} />
                    No Thanks
                  </Button>
                </ButtonsWrapper>
                <ButtonsWrapper>
                  <Button onClick={() => triggerTransition(() => resetState())}>
                    <ButtonOutline zIndex={1} />
                    Play Again
                  </Button>
                </ButtonsWrapper>
              </>
            )}
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
        hoverLookupString={hoverLookupString}
        setHoverLookupString={setHoverLookupString}
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
        isTeammate={isTeammate}
      />
    </GameWrapper>
  );
};
