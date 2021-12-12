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
  playerData = [{}, {}],
  isReversed,
  setDisplayString
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
            abilities={playerData.abilities}
            setDisplayString={setDisplayString}
            isReversed={isReversed}
            ghosts={playerData.lives - 1}
          />
          <HealthBar
            health={playerData.lives}
            setDisplayString={setDisplayString}
          />
          <Kaiju isReversed={isReversed} setDisplayString={setDisplayString} />
        </>
      ) : (
        <>
          <Kaiju setDisplayString={setDisplayString} />
          <HealthBar
            health={playerData.lives}
            setDisplayString={setDisplayString}
          />
          <Abilities
            abilities={playerData.abilities}
            setDisplayString={setDisplayString}
            ghosts={playerData.lives - 1}
          />
        </>
      )}
      <PlayerBorder isReversed={isReversed}>
        <PlayerPicture className="fa fa-user-circle" />
        <AccessoryPicture
          ref={setHoverRef(
            playerData.accessory && playerData.accessory.displayLookup
          )}
          className="fa fa-wrench"
          isReversed={isReversed}
        />
      </PlayerBorder>
      <PassiveAbilities
        setDisplayString={setDisplayString}
        isReversed={isReversed}
        abilities={playerData.abilities}
      />
    </Wrapper>
  );
  return playerUI;
};
