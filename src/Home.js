import React, { useState, useEffect } from "react";
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
    window.history.pushState({}, "Kaiju City", "/home");
  };
  const handleClickGame = () => {
    setIsTutorial(false);
    setIsGame(true);
    window.history.pushState({}, "Kaiju City", "/game");
  };
  const handleClickTutorial = () => {
    setIsTutorial(true);
    setIsGame(false);
    window.history.pushState({}, "Kaiju City", "/tutorial");
  };

  const { pathname } = window.location;

  useEffect(() => {
    switch (pathname) {
      case "/game":
        !isGame && handleClickGame();
        console.log(pathname);
        // handleClickGame();
        break;
      case "/tutorial":
        !isTutorial && handleClickTutorial();
        console.log(pathname);
        // handleClickTutorial();
        break;
      default:
        // (isTutorial || isGame) && handleClickHome();
        console.log(pathname);
        handleClickHome();
        break;
    }
  }, [pathname]);

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
