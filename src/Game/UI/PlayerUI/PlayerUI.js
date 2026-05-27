import React from "react";
import styled from "styled-components";
import { Abilities } from "./Components/Abilities";
import { HealthBar } from "./Components/HealthBar";
import { PassiveAbilities } from "./Components/PassiveAbilities";
import { FloatingEffect } from 'Game/Game';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 400px;
  height: 170px;
  align-self: flex-end;
  ${props => props.isTeammate && "align-content: flex-end; transform: scale(.75) translate(0px, 15px); left: 50px;"}
  pointer-events: auto;
`;

const PlayerBorder = styled.div`
  position: absolute;
  right: 20px;

  ${props => (props.isReversed ? "bottom: 20px;" : "top: 29px;")}

  ${props => props.isBlue ? "width: 125px;height: 125px;" : "width: 120px; height: 120px;"}
  zindex: 1;
  border-radius: 100%;
  overflow: hidden;
`;

const PlayerPicture = styled.div`

  position: absolute;

  background: url(${props => props.src});

  background-position: ${props => props.isBlue ? "3px 0px" : "0px 0px"};
  width: 97%;
  height: 97%;

  ${props =>
    props.isBlue
      ? "filter: drop-shadow(20px -15px 25px blue);"
      : "filter: drop-shadow(20px -15px 25px salmon);"}      
`;

const PlayerPictureBackground = styled.div`
    position: absolute;
    z-index: -1;

    filter: opacity(.8) hue-rotate(
        ${props => props.isBlue ? "148deg" : "301deg"}
      );

    pointer-events: none;
    background: url(spritesheet/horizontal_circuit_disc_sprite.png) center center;
    width: 592px;
    height: 359px;
    animation: 4s steps(9) 0s infinite normal none running playSpriteSheet;
    transform: ${props => props.isBlue ? "scale(0.3, 0.45) translate(-776px, -274px)" : "scale(0.3, 0.45) translate(-785px, -274px);"};   
`;
export const PlayerUI = ({
  playerData = [
    {
      lives: 0,
      isDead: false,
      livesModifier: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" },
      gender: "guy"
    },
    {
      lives: 0,
      isDead: false,
      livesModifier: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" },
      gender: "girl"
    }
  ],
  setPlayerData,
  kaijuData = [],
  setDisplayString,
  setTeleportData,
  setTileStatuses,
  playerIndex,
  _,
  isTeammate,
  scale,
  percentZoom,
  isPaused,
  accTime
}) => {
  const { gender } = playerData[playerIndex];
  const isReversed = isTeammate;

  const _playerUI = (
    <Wrapper percentZoom={percentZoom} isTeammate={isTeammate}>
      {/* <div style={{ position: "absolute", color: "#fff" }}>{ playerData[playerIndex].numTilesModifier}</div> */}
      {isReversed ? (
        <>
          <Abilities
            playerData={playerData}
            setPlayerData={setPlayerData}
            kaijuData={kaijuData}
            setTileStatuses={setTileStatuses}
            scale={scale}
            abilities={
              (playerData.length && playerData[playerIndex].abilities) || []
            }
            setDisplayString={setDisplayString}
            isReversed={isReversed}
            playerIndex={playerIndex}
            setTeleportData={setTeleportData}
            isPaused={isPaused}
            accTime={accTime}
          />
          <HealthBar
            health={playerData.length && (playerData[playerIndex].lives || 0)}
            isDead={playerData.length && (playerData[playerIndex].isDead || false)}
            healthModifier={playerData.length && playerData[playerIndex].livesModifier || 0}
            setDisplayString={setDisplayString}
            isTeammate={isTeammate}
          />
        </>
      ) : (
        <>
          <HealthBar
            health={playerData.length && (playerData[playerIndex].lives || 0)}
            isDead={playerData.length && (playerData[playerIndex].isDead || false)}
            healthModifier={playerData.length && playerData[playerIndex].livesModifier || 0}
            setDisplayString={setDisplayString}
          />
          <Abilities
            isLarge={true}
            playerData={playerData}
            setPlayerData={setPlayerData}
            kaijuData={kaijuData}
            setTileStatuses={setTileStatuses}
            scale={scale}
            abilities={
              (playerData.length && playerData[playerIndex].abilities) || []
            }
            setDisplayString={setDisplayString}
            playerIndex={playerIndex}
            setTeleportData={setTeleportData}
            isPaused={isPaused}
            accTime={accTime}
          />
        </>
      )}
      <PlayerBorder isBlue={gender == "guy" ? true : false} isReversed={isReversed}>
        <PlayerPicture
          src={gender == "guy" ? "player_avatar.png" : "teammate_avatar.png"}
          className="fa fa-user-circle"
          isBlue={gender == "guy" ? true : false}
        />
        <PlayerPictureBackground isBlue={gender == "guy" ? true : false} />
      </PlayerBorder>
      <PassiveAbilities
        accTime={accTime}
        setDisplayString={setDisplayString}
        isReversed={true}
        isTeammate={isTeammate}
        abilities={
          (playerData &&
            playerData.length &&
            playerData[playerIndex] &&
            playerData[playerIndex].abilities) ||
          []
        }
      />
    </Wrapper>
  );
  return isTeammate ?
    <FloatingEffect 
      styles={" display: flex; flex-direction: column; animation-delay: 3s;"}
      duration={"5"}>
      {_playerUI}
    </FloatingEffect>
    : _playerUI;
};
