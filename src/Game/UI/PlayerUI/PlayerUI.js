import React from "react";
import styled from "styled-components";
import { Abilities } from "./Components/Abilities";
import { HealthBar } from "./Components/HealthBar";
import { PassiveAbilities } from "./Components/PassiveAbilities";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 400px;
  height: 170px;
  align-self: flex-end;
  ${props => props.isTeammate && "align-content: flex-end; transform: scale(.75); left: 50px;"}
  pointer-events: auto;
`;

const PlayerBorder = styled.div`
  position: absolute;
  right: 10px;
  ${props => (props.isReversed ? "bottom:10px;" : "top:10px;")}
  width: 150px;
  zindex: 1;
  height: 150px;
  border-radius: 100%;
  overflow: hidden;
`;

const PlayerPicture = styled.div`

  position: relative;

  background: url(${props => props.src});

  background-position: 17px 17px;
  width: 97%;
  height: 97%;

  ${props =>
    props.isBlue
      ? "filter: drop-shadow(20px -15px 25px blue);"
      : "filter: drop-shadow(20px -15px 25px salmon);"}  

 &::after{
    filter: opacity(.2) hue-rotate(
        ${props => props.isBlue ? "148deg" : "301deg"}
      );
    z-index: -1;
    position: absolute;
    content: "";
    pointer-events: none;
    background: url(spritesheet/horizontal_circuit_disc_sprite.png) center center;
    width: 592px;
    height: 359px;
    animation: 1s steps(9) 0s infinite normal none running playSpriteSheet;
    transform: scale(.4, .6) translate(-560px, -178px);
 }     
`;
export const PlayerUI = ({
  playerData = [
    {
      lives: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" },
      gender: "guy"
    },
    {
      lives: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" },
      gender: "girl"
    }
  ],
  kaijuData = [],
  setDisplayString,
  setPlayerData,
  setTeleportData,
  setTileStatuses,
  playerIndex,
  _,
  isTeammate,
  scale,
  percentZoom,
  isPaused
}) => {
  const { gender } = playerData[playerIndex];
  const isReversed = isTeammate;

  const _playerUI = (
    <Wrapper percentZoom={percentZoom} isTeammate={isTeammate}>
      {isReversed ? (
        <>
          <Abilities
            playerData={playerData}
            kaijuData={kaijuData}
            setTileStatuses={setTileStatuses}
            scale={scale}
            abilities={
              (playerData.length && playerData[playerIndex].abilities) || []
            }
            setDisplayString={setDisplayString}
            isReversed={isReversed}
            playerIndex={playerIndex}
            setPlayerData={setPlayerData}
            setTeleportData={setTeleportData}
            isPaused={isPaused}
          />
          <HealthBar
            health={(playerData.length && playerData[playerIndex].lives) || 0}
            setDisplayString={setDisplayString}
            isTeammate={isTeammate}
          />
        </>
      ) : (
        <>
          <HealthBar
            health={(playerData.length && playerData[playerIndex].lives) || 0}
            setDisplayString={setDisplayString}
          />
          <Abilities
            isLarge={true}
            playerData={playerData}
            kaijuData={kaijuData}
            setTileStatuses={setTileStatuses}
            scale={scale}
            abilities={
              (playerData.length && playerData[playerIndex].abilities) || []
            }
            setDisplayString={setDisplayString}
            playerIndex={playerIndex}
            setPlayerData={setPlayerData}
            setTeleportData={setTeleportData}
            isPaused={isPaused}
          />
        </>
      )}
      <PlayerBorder isReversed={isReversed}>
        <PlayerPicture
          src={gender == "guy" ? "player_avatar.png" : "teammate_avatar.png"}
          className="fa fa-user-circle"
          isBlue={gender == "guy" ? true : false}
        />
      </PlayerBorder>
      <PassiveAbilities
        setDisplayString={setDisplayString}
        isReversed={true}
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
  return _playerUI;
};
