import React, { useState } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { Game } from "./Game/Game";
import { MainMenu } from "./MainMenu";

export const Home = ({ triggerTransition }) => {
  /*
        detect browser -> if not Chrome, show "Best experienced on Chrome" banner on bottom left of menu with link.
        add clouds to bottom of title
        transition anim -> make clouds
    */
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
