import React, { useState, useEffect, createContext } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { Game } from "./Game/Game";
import { MainMenu } from "./MainMenu";

export const SelectedAvatarContext = createContext({ selectedAvatar: "guy", setSelectedAvatar: () => {}, isAvatarChangedOnce: false, setIsAvatarChangedOnce: () => {} });

export const Home = ({ triggerTransition }) => {
  const [selectedAvatar, setSelectedAvatar] = useState("guy");
  const [isAvatarChangedOnce, setIsAvatarChangedOnce] = useState(false);
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
        break;
      case "/tutorial":
        !isTutorial && handleClickTutorial();
        break;
      default:
        handleClickHome();
    }
  }, [pathname]);

  return <SelectedAvatarContext.Provider value={{ selectedAvatar, setSelectedAvatar, isAvatarChangedOnce, setIsAvatarChangedOnce }}>
    {isTutorial ? (
      <Tutorial
        triggerTransition={triggerTransition}
        handleClickHome={handleClickHome}
        handleClickGame={handleClickGame}
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
    )}
  </SelectedAvatarContext.Provider>
};
