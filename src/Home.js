import React, { useState } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { Game } from "./Game/Game";
import { MainMenu } from "./MainMenu";

export const Home = ({ triggerTransition }) => {
  const [isTutorial, setIsTutorial] = useState(false);
  const [isGame, setIsGame] = useState(false);
  const handleClickHome = () => {
    setIsTutorial(false);
    setIsGame(false);
  };
  const handleClickGame = () => {
    setIsTutorial(false);
    setIsGame(true);
  };
  const handleClickTutorial = () => {
    setIsTutorial(true);
    setIsGame(false);
  };
  return isTutorial ? (
    <Tutorial
      triggerTransition={triggerTransition}
      handleClickHome={handleClickHome}
    />
  ) : isGame ? (
    <Game
      triggerTransition={triggerTransition}
      handleClickHome={() => triggerTransition(handleClickHome)}
    />
  ) : (
    <MainMenu
      handleClickGame={() => triggerTransition(handleClickGame)}
      handleClickTutorial={() => triggerTransition(handleClickTutorial)}
    />
  );
};
