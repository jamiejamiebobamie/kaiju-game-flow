import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 300px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  margin-top: -50px;
`;

export const Display = ({ hoveredContent = null }) => {
  return <Wrapper />;
};
