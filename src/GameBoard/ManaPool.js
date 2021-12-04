import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { moveTo, useInterval, getRandomAdjacentLocation } from "../Utils/utils";

export const ManaPool = ({ kaijuData, width, height, color }) => {
  return (
    <svg
      style={{
        position: "absolute",
        zIndex: "1000000",
        borderStyle: "solid",
        borderWidth: "thin",
        width: `${width ? width : 500}`,
        height: `${height ? height : 800}`,
        pointerEvents: "none"
      }}
    >
      <polygon
        style={{
          opacity: ".4"
        }}
        fill={color}
        points={kaijuData.reduce(
          (acc, item) =>
            acc
              ? acc + ` ${item.charLocation.x} ${item.charLocation.y - 20}`
              : `${item.charLocation.x} ${item.charLocation.y - 20}`,
          ""
        )}
      />
    </svg>
  );
};
