import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../Utils/utils";
/* border-style: solid;
border-thickness: thin; */
const Wrapper = styled.div`
  display: flex;
  width: 70%;
  height: 70px;
  border-radius: 10px;
  overflow: scroll;
`;
const KaijuIcon = styled.img`
  min-width: 30px;
  margin-left: 10px;
  justify-self: center;
  align-self: center;
  height: 30px;
`;
export const Kaiju = ({
  kaijuArr = [
    { displayLookup: "kaijuGlass" },
    { displayLookup: "kaijuFire" },
    { displayLookup: "kaijuWood" },
    { displayLookup: "kaijuLightning" },
    { displayLookup: "kaijuDeath" },
    { displayLookup: "kaijuBubble" },
    { displayLookup: "kaijuMetal" }
  ],
  setDisplayString
}) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const kaijuIcons = kaijuArr.map(({ displayLookup }) => (
    <KaijuIcon
      key={displayLookup}
      src={"testKaijuTile.png"}
      ref={setHoverRef(displayLookup)}
      title="test"
      alt="image of test"
    />
  ));
  return <Wrapper>{kaijuIcons}</Wrapper>;
};
