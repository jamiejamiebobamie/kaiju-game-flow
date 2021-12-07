import React, { useEffect } from "react";
import styled from "styled-components";
import { Abilities } from "./Abilities";
import { HealthBar } from "./HealthBar";
import { Kaiju } from "./Kaiju";
import { useHover } from "../../Utils/utils";

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
  border-radius: 10px;
  border-radius: 100%;
  border-style: solid;
  border-thickness: thin;
  overflow: hidden;
`;
const PlayerPicture = styled.i`
  margin-top: 70px;
  margin-left: 68px;
  transform: scale(8, 9);
`;
const AccessoryPicture = styled.img`
  position: absolute;
  right: 20px;
  bottom: 10px;
  z-index: 2;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border-radius: 100%;
  border-style: solid;
  border-thickness: thin;
  background-color: white;
`;
export const Player = ({
  isReversed,
  setDisplayString,
  accessory = {
    displayLookup: "testAccessoryLookup",
    accessoryImgFile: "fire_icon.png"
  }
}) => {
  const [hoverRef, setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const playerUI = (
    <Wrapper>
      {isReversed ? (
        <>
          <Abilities
            setDisplayString={setDisplayString}
            isReversed={isReversed}
          />
          <HealthBar setDisplayString={setDisplayString} />
          <Kaiju setDisplayString={setDisplayString} />
        </>
      ) : (
        <>
          <Kaiju setDisplayString={setDisplayString} />
          <HealthBar setDisplayString={setDisplayString} />
          <Abilities setDisplayString={setDisplayString} />
        </>
      )}
      <PlayerBorder isReversed={isReversed}>
        <PlayerPicture className="fa fa-user" />
        <AccessoryPicture
          ref={setHoverRef(accessory.displayLookup)}
          src={accessory.accessoryImgFile}
          isReversed={isReversed}
        />
      </PlayerBorder>
    </Wrapper>
  );
  return playerUI;
};
