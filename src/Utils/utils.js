import React, { useState, useEffect, useRef } from "react";

export const getRandomIntInRange = ({ min = 0, max }) => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max + 1);
  const randomInt = Math.floor(Math.random() * (_max - _min) + _min);
  return randomInt;
};

export const moveTo = ({
  curr_location,
  moveFromLocation,
  moveToLocation,
  moveSpeed,
  setLocation,
  setHasArrived
}) => {
  const x_To = moveToLocation.x;
  const y_To = moveToLocation.y;
  const x_From = moveFromLocation.x;
  const y_From = moveFromLocation.y;
  const { x, y } = curr_location;
  const distanceFromStart = Math.sqrt(
    (x_From - x) * (x_From - x) + (y_From - y) * (y_From - y)
  );
  const distanceToFinish = Math.sqrt(
    (x_To - x) * (x_To - x) + (y_To - y) * (y_To - y)
  );
  const totalDistance = Math.sqrt(
    (x_To - x_From) * (x_To - x_From) + (y_To - y_From) * (y_To - y_From)
  );
  if (distanceFromStart > totalDistance) setHasArrived(true);
  const x_dir = (x_To - x) / distanceToFinish;
  const y_dir = (y_To - y) / distanceToFinish;
  setLocation(({ x, y }) => {
    return {
      x: x + x_dir * moveSpeed,
      y: y + y_dir * moveSpeed
    };
  });
};
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
