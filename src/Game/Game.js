import React, { useState, useEffect, useRef } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { MainGame } from "./MainGame/MainGame";

export const Game = () => {
  const [isTutorial, setIsTutorial] = useState(true);
  const [pickedAbilities, setPickedAbilities] = useState([]);
  return isTutorial ? (
    <Tutorial
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
    />
  ) : (
    <MainGame pickedAbilities={pickedAbilities} />
  );
};
