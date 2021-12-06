import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../Utils/utils";

const Wrapper = styled.div`
  display: flex;
  width: 70%;
  height: 70px;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  overflow: scroll;
`;
const KaijuIcon = styled.img`
  min-width: 30px;
  margin-left: 10px;
  justify-self: center;
  align-self: center;
  height: 30px;
  border-radius: 100%;
  border-style: solid;
`;
export const Kaiju = ({
  kaijuArr = [{}, {}, {}, {}, {}, {}, {}],
  setDisplayString
}) => {
  const [hoverRef, isHovered] = useHover();
  useEffect(
    () => (isHovered ? setDisplayString("test") : setDisplayString(null)),
    [isHovered]
  );
  const kaijuIcons = kaijuArr.map(abil => (
    <KaijuIcon src={"fire_icon.png"} title="test" alt="image of test" />
  ));
  return <Wrapper>{kaijuIcons}</Wrapper>;
};
