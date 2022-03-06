import React, { useEffect } from "react";
import styled from "styled-components";
import { Abilities } from "./Components/Abilities";
import { HealthBar } from "./Components/HealthBar";
import { Kaiju } from "./Components/Kaiju";
import { PassiveAbilities } from "./Components/PassiveAbilities";
import { useHover } from "../../../Utils/utils";

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
    props.isTeammate && "align-content: flex-end; transform:scale(.75); "}
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
  /* pointer-events: none; */
`;
const PlayerPicture = styled.i`
  margin-top: 70px;
  margin-left: 68px;
  transform: scale(10);
  color: #db974f;
`;
const ClassPicture = styled.i`
  display: flex;
  justify-content: center;
  position: absolute;
  right: 20px;
  bottom: 10px;
  z-index: 2;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  border-style: solid;
  border-thickness: thin;
  border-color: #152642;
  color: #152642;
  background-color: #db974f;
  align-items: center;
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
  kaijuKillCount,
  isTeammate,
  scale
}) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
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
          ref={setHoverRef(`modifiers ${playerIndex}`)}
          className="fa fa-user-circle"
        />
        <ClassPicture
          ref={setHoverRef(`class ${playerIndex}`)}
          className="fa fa-magic"
          isReversed={true}
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
// <Kaiju
//   kaijuArr={kaijuKillCount.filter(c => c === playerIndex)}
//   setDisplayString={setDisplayString}
// />
