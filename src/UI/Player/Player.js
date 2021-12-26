import React, { useEffect } from "react";
import styled from "styled-components";
import { Abilities } from "./Abilities";
import { HealthBar } from "./HealthBar";
import { Kaiju } from "./Kaiju";
import { useHover } from "../../Utils/utils";
import { PassiveAbilities } from "./PassiveAbilities";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 200px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
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
const PlayerPicture = styled.i`
  margin-top: 70px;
  margin-left: 68px;
  transform: scale(10);
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
  border-radius: 10px;
  border-radius: 100%;
  border-style: solid;
  border-thickness: thin;
  background-color: #f2e3cc;
  align-items: center;
`;
export const Player = ({
  playerData = [
    {
      lives: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" },
      abilities: []
    },
    {
      lives: 0,
      playerClass: "",
      moveSpeed: "",
      modifiers: "",
      abilities: [],
      accessory: { displayLookup: "" },
      abilities: []
    }
  ],
  kaijuData = [],
  isReversed,
  setDisplayString,
  setPlayerData,
  setTeleportData,
  setTileStatuses,
  playerIndex,
  scale
  // accessory = {
  //   displayLookup: "testAccessoryLookup",
  //   accessoryImgFile: "fire_icon.png"
  // }
}) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const playerUI = (
    <Wrapper>
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
          <Kaiju
            kaijuArr={kaijuData.filter(k => k.trophy === playerIndex)}
            isReversed={isReversed}
            setDisplayString={setDisplayString}
          />
        </>
      ) : (
        <>
          <Kaiju
            kaijuArr={kaijuData.filter(k => k.trophy === playerIndex)}
            setDisplayString={setDisplayString}
          />
          <HealthBar
            health={(playerData.length && playerData[playerIndex].lives) || 0}
            setDisplayString={setDisplayString}
          />
          <Abilities
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
      <PlayerBorder isReversed={isReversed}>
        <PlayerPicture
          ref={setHoverRef(
            `modifiers ${playerIndex}`
            // isReversed
            //   ? playerData[1].accessory && playerData[1].accessory.displayLookup
            //   : playerData[0].accessory && playerData[0].accessory.displayLookup
          )}
          className="fa fa-user-circle"
        />
        <ClassPicture
          ref={setHoverRef(
            `class ${playerIndex}`
            // isReversed
            //   ? playerData[1].accessory && playerData[1].accessory.displayLookup
            //   : playerData[0].accessory && playerData[0].accessory.displayLookup
          )}
          className="fa fa-wrench"
          isReversed={isReversed}
        />
      </PlayerBorder>
      <PassiveAbilities
        setDisplayString={setDisplayString}
        isReversed={isReversed}
        abilities={
          (playerData &&
            playerData.length &&
            playerData[playerIndex].abilities) ||
          []
          // playerData.length
          //   ? isReversed
          //     ? playerData[1].abilities
          //     : playerData[0].abilities
          //   : []
        }
      />
    </Wrapper>
  );
  return playerUI;
};
