import React, { useState, useEffect, createContext } from "react";
import { MainMenu } from "./MainMenu";
import { Game } from "./Game/Game";
import { Tutorial } from "./Tutorial/Tutorial";
import { Settings } from "./Settings/Settings";

const PAGES = Object.freeze({
  Home: 'Home',
  Game: 'Game',
  Tutorial: 'Tutorial',
  Settings: 'Settings'
});

export const Difficulty = Object.freeze({
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Xtreme: 4
});

export const GlobalSettingsContext = createContext({ 
  selectedAvatar: "guy", 
  setSelectedAvatar: () => { }, 
  isAvatarChangedOnce: false, 
  setIsAvatarChangedOnce: () => { },
  selectedDifficulty: Difficulty.Medium, 
  setSelectedDifficulty: () => { }, 
});

export const Home = ({ triggerTransition }) => {
  const [selectedAvatar, setSelectedAvatar] = useState("guy");
  const [selectedDifficulty, setSelectedDifficulty] = useState(Difficulty.Medium);
  const [isAvatarChangedOnce, setIsAvatarChangedOnce] = useState(false);
  const [currPage, setCurrPage] = useState(PAGES.Home);
  const handleClickHome = () => {
    setCurrPage(PAGES.Home)
    window.history.pushState({}, "Kaiju City", "/home");
  };
  const handleClickGame = () => {
    setCurrPage(PAGES.Game)
    window.history.pushState({}, "Kaiju City", "/game");
  };
  const handleClickTutorial = () => {
    setCurrPage(PAGES.Tutorial)
    window.history.pushState({}, "Kaiju City", "/tutorial");
  };
  const handleClickSettings = () => {
    setCurrPage(PAGES.Settings)
    window.history.pushState({}, "Kaiju City", "/settings");
  };

  const { pathname } = window.location;
  useEffect(() => {
    switch (pathname) {
      case "/game":
        currPage != PAGES.Game && handleClickGame();
        break;
      case "/tutorial":
        currPage != PAGES.Tutorial && handleClickTutorial();
        break;
      case "/settings":
        currPage != PAGES.Settings && handleClickSettings();
        break;
      default:
        handleClickHome();
    }
  }, [pathname]);

  return <GlobalSettingsContext.Provider 
            value={{ 
              selectedAvatar, 
              setSelectedAvatar, 
              isAvatarChangedOnce, 
              setIsAvatarChangedOnce,
              selectedDifficulty,
              setSelectedDifficulty
            }}>
    {currPage == PAGES.Settings ? (
        <Settings
          triggerTransition={triggerTransition}
          handleClickHome={() => triggerTransition(handleClickHome)}
          handleClickGame={() => triggerTransition(handleClickGame)}
        />
      ) : currPage == PAGES.Tutorial ? (
        <Tutorial
          triggerTransition={triggerTransition}
          handleClickHome={handleClickHome}
          handleClickGame={handleClickGame}
        />
      ) : currPage == PAGES.Game ? (
        <Game
          triggerTransition={triggerTransition}
          handleClickHome={() => triggerTransition(handleClickHome)}
        />
      ) : (
        <MainMenu
          handleClickGame={() => triggerTransition(handleClickGame)}
          handleClickTutorial={() => triggerTransition(handleClickTutorial)}
          handleClickSettings={() => triggerTransition(handleClickSettings)}
        />
      )}
  </GlobalSettingsContext.Provider>
};
