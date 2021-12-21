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
const AccessoryPicture = styled.i`
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
    { lives: 0, abilities: [], accessory: { displayLookup: "" } },
    { lives: 0, abilities: [], accessory: { displayLookup: "" } }
  ],
  kaijuData = [],
  isReversed,
  setDisplayString,
  setPlayerData,
  setTileStatuses,
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
            abilities={(playerData.length && playerData[1].abilities) || []}
            setDisplayString={setDisplayString}
            isReversed={isReversed}
            playerIndex={1}
          />
          <HealthBar
            health={(playerData.length && playerData[1].lives) || 0}
            setDisplayString={setDisplayString}
          />
          <Kaiju isReversed={isReversed} setDisplayString={setDisplayString} />
        </>
      ) : (
        <>
          <Kaiju setDisplayString={setDisplayString} />
          <HealthBar
            health={(playerData.length && playerData[0].lives) || 0}
            setDisplayString={setDisplayString}
          />
          <Abilities
            playerData={playerData}
            kaijuData={kaijuData}
            setTileStatuses={setTileStatuses}
            scale={scale}
            abilities={(playerData.length && playerData[0].abilities) || []}
            setDisplayString={setDisplayString}
            playerIndex={0}
          />
        </>
      )}
      <PlayerBorder isReversed={isReversed}>
        <PlayerPicture className="fa fa-user-circle" />
        <AccessoryPicture
          ref={setHoverRef(
            ""
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
          playerData.length
            ? isReversed
              ? playerData[1].abilities
              : playerData[0].abilities
            : []
        }
      />
    </Wrapper>
  );
  return playerUI;
};
