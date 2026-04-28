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
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  background-color: #152642;
  border-color: #db974f;
  box-shadow: 3px 7px 10px black;
  align-self: flex-end;
  border-style: solid;
  border-thickness: thin;
  border-color: #db974f;
  color: #db974f;
  background-color: #152642;
  ${props =>
    props.isTeammate && "align-content: flex-end; transform:scale(.75); left: 50px;"}
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
const PlayerPicture = styled.img`
  margin-top: -1px;
  margin-left: 0px;
  padding-left: 20px;
  padding-right: 20px;
  border-style: solid;
  border-thickness: 10px;
  border-radius: 100%;
  border-color: #db974f;
  background-color: rgba(0, 0, 0, 0.5);
  ${props =>
    props.isReversed
      ? "filter: drop-shadow(20px -15px 25px salmon);"
      : "filter: drop-shadow(20px -15px 25px blue);"}  
`;
export const PlayerUI = ({
  playerData = [
    {
      lives: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" }
    },
    {
      lives: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" }
    }
  ],
  kaijuData = [],
  isReversed,
  setDisplayString,
  setPlayerData,
  setTeleportData,
  setTileStatuses,
  playerIndex,
  _,
  isTeammate,
  scale
}) => {
  const _playerUI = (
    <Wrapper isTeammate={isTeammate}>
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
          />
        </>
      )}
      <PlayerBorder isReversed={true}>
        <PlayerPicture
          src={playerIndex === 0 ? "player_avatar.png" : "teammate_avatar.png"}
          height="150px"
          className="fa fa-user-circle"
          isReversed={isReversed}
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
