import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 300px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  text-font: 30px;
  font-alignment: 30px;
  color: black;
`;
export const Display = ({ displayString, hoveredContent = null }) => {
  return <Wrapper>{displayString}</Wrapper>;
};
