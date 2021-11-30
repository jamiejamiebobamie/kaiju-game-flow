import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

const Overlay = styled.canvas`
  width: 500px;
  height: 800px;
  position: absolute;
  opacity: 0.5;
`;
export const ManaPoolOverlay = ({ manaWellLocations = null }) => {
  const canvasRef = useRef(null);
  const verts =
    manaWellLocations && manaWellLocations.length > 2
      ? manaWellLocations.reduce(
          (acc, item, i) =>
            i === 0
              ? `ctx.moveTo(${item.x},${item.y});`
              : `${acc}ctx.lineTo(${item.x},${item.y});`,
          ""
        )
      : "";
  const verts2 =
    manaWellLocations && manaWellLocations.length > 2
      ? manaWellLocations.reduce(
          (acc, item, i) =>
            i === 0
              ? `ctx.moveTo(${item.y},${item.x});`
              : `${acc}ctx.lineTo(${item.y},${item.x});`,
          ""
        )
      : "";
  const my_string = `
          ctx.beginPath();
          ${verts}
          ctx.fillStyle = "rgba(1, 12, 255, 0.5)";
          ctx.fill();
          `;
  const my_string2 = `
                  ctx.beginPath();
                  ${verts2}
                  ctx.fillStyle = "rgba(23, 54, 33, 0.5)";
                  ctx.fill();
                  `;
  const draw = (ctx, frameCount) => {
    // drawManaPools(ctx);
    eval(my_string);
    eval(my_string2);
  };
  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
  }
  useEffect(() => {
    if (canvasRef && canvasRef.current)
      canvasRef.current.addEventListener("mousedown", function(e) {
        getCursorPosition(canvasRef.current, e);
      });
  }, [canvasRef]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;
    //Our draw came here
    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <Overlay ref={canvasRef} />;
};
