import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../Utils/utils";
/* border-style: solid;
border-thickness: thin; */
const Wrapper = styled.div`
  /* background-color: red; */
  display: flex;
  padding-top: 10px;
  ${props =>
    props.isReversed
      ? "margin-top: -10px;"
      : "margin-bottom: -10px; padding-top: 10px;"}
  width: 70%;
  height: 60px;
  border-radius: 10px;
  overflow: scroll;
  /* margin: 1px; */
`;
const KaijuIcon = styled.i`
  min-width: 30px;
  margin-left: 10px;
  justify-self: center;
  align-self: center;
  height: 30px;
`;
export const Kaiju = ({
  kaijuArr = [
    { displayLookup: "kaijuGlass", name: "Mothra" },
    { displayLookup: "kaijuFire", name: "Not-Godzilla" },
    { displayLookup: "kaijuWood", name: "Kudzu" },
    { displayLookup: "kaijuLightning", name: "Gargantula" },
    { displayLookup: "kaijuDeath", name: "Giant Mantis" },
    { displayLookup: "kaijuBubble", name: "Parade Float" },
    { displayLookup: "kaijuMetal", name: "Mechatron" }
  ],
  setDisplayString,
  isReversed
}) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const kaijuIcons = kaijuArr.map(({ displayLookup, name }) => (
    <KaijuIcon
      key={displayLookup}
      className="fa fa-optin-monster"
      ref={setHoverRef(displayLookup)}
      title={name}
      alt={name}
    />
  ));
  return <Wrapper isReversed={isReversed}>{kaijuIcons}</Wrapper>;
};
