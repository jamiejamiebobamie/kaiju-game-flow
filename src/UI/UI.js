import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Player } from "./Player/Player";
import { Display } from "./Display";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  min-width: 500px;
  width: 500px;
  height: 800px;
`;
export const UI = ({ playerData = [{}, {}] }) => {
  const [displayString, setDisplayString] = useState(null);
  useEffect(() => console.log(displayString), [displayString]);
  return (
    <Wrapper>
      <Player setDisplayString={setDisplayString} />
      <Display displayString={displayString} />
      <Player setDisplayString={setDisplayString} isReversed={true} />
    </Wrapper>
  );
};
