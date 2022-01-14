import React, { useState, useEffect, useRef } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { MainGame } from "./MainGame/MainGame";

export const Game = () => {
  const [isTutorial, setIsTutorial] = useState(true);
  const [pickedAbilities, setPickedAbilities] = useState([]);
  const handeClickPlay = () =>
    pickedAbilities.length === 3 && setIsTutorial(false);
  return isTutorial ? (
    <Tutorial
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handeClickPlay={handeClickPlay}
    />
  ) : (
    <MainGame pickedAbilities={pickedAbilities} />
  );
};
