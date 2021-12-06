import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../Utils/utils";

const Wrapper = styled.div`
  display: flex;
  ${props =>
    props.isReversed ? "flex-flow: row wrap;" : "flex-flow: row wrap-reverse;"}
  justify-content: flex-start;
  width: 65%;
  height: 100%;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  overflow: scroll;
  overflow-y: scroll;
`;
const AbilityIcon = styled.img`
  margin-left: 10px;
  justify-self: center;
  align-self: center;
  border-radius: 100%;
  border-style: solid;
  min-width: 50px;
  height: 50px;
`;
export const Abilities = ({
  isReversed,
  abilityArr = [{}, {}, {}, {}, {}, {}, {}],
  setDisplayString
}) => {
  const [hoverRef, isHovered] = useHover();
  useEffect(
    () => (isHovered ? setDisplayString("test") : setDisplayString(null)),
    [isHovered]
  );
  // look up best way to create dynamic refs.
  const abilityButtons = abilityArr.map(abil => (
    <AbilityIcon src={"fire_icon.png"} title="test" alt="test desc" />
  ));
  return <Wrapper isReversed={isReversed}>{abilityButtons}</Wrapper>;
};
