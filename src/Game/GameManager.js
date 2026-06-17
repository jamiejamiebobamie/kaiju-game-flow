import { GameMode, ZoomLvl } from 'Utils/gameState';
import { TimeoutHandler } from './TimeoutHandler';
import { GameManagerProxy } from './GameManagerProxy';
import { PlayerInputHandler } from './PlayerInputHandler';
import { SettingsManager } from './SettingsManager';
import { GameBoardPiecesManager } from './GameBoardPiecesManager';
import { KaijuManager } from './KaijuManager';
import { GameBoardManager } from './GameBoardManager';

export class GameManager {
    constructor({ scale, settingsManager }) {
        this.zoomLvl = ZoomLvl.NoZoom;
        this.score = 0;
        this.isPaused = false;
        this.tutorialIndex = 0;
        this.settingsManager = !!settingsManager ? settingsManager : new SettingsManager();
        this.playerInputHandler = new PlayerInputHandler();
        this.timeoutHandler = new TimeoutHandler();
        this.gameManagerProxy = new GameManagerProxy();
        this.gameBoardPiecesManager = new GameBoardPiecesManager({ gameManagerProxy: this.gameManagerProxy });
        this.gameBoardManager = new GameBoardManager({ gameManagerProxy: this.gameManagerProxy, scale });
        this.kaijuManager = new KaijuManager({ gameManagerProxy: this.gameManagerProxy });
    }

    setScale(scale) {
        this.scale = scale;
    }

    initGame() {

        this.resetGame();

        // SIDE EFFECT: overwrites ability data with user-definded ability edits (if any)
        this.settingsManager.initAbilityStatusData()

        // - what is player's avatar?
        const playerAvatar = this.settingsManager.getPlayerAvatar();

        // - what are player's chosen abilities?
        const playerAbilities = this.settingsManager.getPlayerChosenAbilities();

        // add player
        this.gameBoardPiecesManager.addPlayer({ playerAvatar, playerAbilities });

        const gameMode = this.settingsManager.getGameMode()

        const mandatoryTeammateGamemodes = [
            GameMode.Tutorial,
            GameMode.StoryPlusTutorial,
            GameMode.Story
        ]
        // - does player want a teammate?
        if (mandatoryTeammateGamemodes.includes(gameMode) || this.settingsManager.getIsTeammate()) {
            const teammateAvatar = playerAvatar == 'guy' ? 'girl' : 'guy';
            const teammateAbilities = this.settingsManager.getThreeRandomAbilities();

            // add teammate
            this.gameBoardPiecesManager.addTeammate({ teammateAvatar, teammateAbilities });
        }

        // must be set before calling updateBounds
        this.gameBoardManager.setUpdateProxyProps(this.updateProxyProps);

        // TO-DO: pass-in correct params for desired GameMode...
        // if (gameMode == GameMode.Story)
        this.gameBoardManager.updateBounds({}/* ...to peninsula map */);

        this.gameBoardManager.initTiles();

        this.gameBoardPiecesManager.initPlayerLocationsOnBoard();
    }

    movePieces(accTime) {
        if (this.isPaused) return;
        this.gameBoardPiecesManager.movePieces({ accTime, timeoutHandler: this.timeoutHandler, playerInputHandler: this.playerInputHandler });
    }

    startKaijuSpawner(accTime) {
        if (!this.kaijuManager.getIsKaiju())
            this.kaijuManager.startKaijuSpawner(accTime);
    }

    updateTileState(accTime){
        this.gameBoardManager.updateTileState(accTime);
    }

    getIsGameOver() {
        const isSomeAlive = this.gameBoardPiecesManager.getIsSomePiecesAlive();
        if (!isSomeAlive) return true; // GAME OVER

        const isOnlyOneTeamStillAlive = this.gameBoardPiecesManager.getIsAllLivingPiecesFromOneTeam();
        return isOnlyOneTeamStillAlive; // GAME OVER
    }

    updateScore = (teamIndex) => {
        // what about charmed players?
        const playerTeamIndex = this.gameBoardPiecesManager.getPlayerTeamIndex();
        if (teamIndex != playerTeamIndex) {
            this.score += 1;
        }
    }

    goToTutorialPage(tutorialIndex) {
        /*
            Tutorial is a GameMode and is managed by the GameManager    
        */
        this.tutorialIndex = tutorialIndex;
    }

    togglePauseGame(accTime) {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.timeoutHandler.pauseTimeouts(accTime);
        } else {
            this.timeoutHandler.restartTimeouts(accTime);
        }
    }

    resetGame() {
        this.score = 0;
        this.timeoutHandler.reset();
        this.gameBoardPiecesManager.resetPieces();
        this.kaijuManager.setKaijuCount(0);
        this.gameBoardManager.resetTiles();
    }

    updateProxyProps = () => {
        this.gameManagerProxy.updateProps({
            updateScore: this.updateScore,
            registerTimeout: this.timeoutHandler.registerTimeout,
            unregisterTimeout: this.timeoutHandler.unregisterTimeout,
            getAbilityAndTileStatusData: this.settingsManager.getAbilityAndTileStatusData,
            getKaijuAbilities: this.settingsManager.getKaijuAbilities,
            determineKaijuDetailsFromDifficulty: () => this.kaijuManager.determineKaijuDetailsFromDifficulty(this.settingsManager.getDifficulty()),
            getFlattenedArrayIndex: this.gameBoardManager.getFlattenedArrayIndex,
            getDmg: this.gameBoardManager.getDmg,
            getPathToClosestEnemy: this.gameBoardManager.getPathToClosestEnemy,
            getClosestEnemy: this.gameBoardManager.getClosestEnemy,
            getCharXAndYFromTileIndex: this.gameBoardManager.getCharXAndYFromTileIndex,
            getRandomTileIndexOnBoard: this.gameBoardManager.getRandomTileIndexOnBoard,
            getMoveOntoGameBoardMovementData: this.gameBoardManager.getMoveOntoGameBoardMovementData,
            moveTo: this.gameBoardManager.moveTo,
            getTileOffsetFromDir: this.gameBoardManager.getTileOffsetFromDir,
            getIsInBounds: this.gameBoardManager.getIsInBounds,
            getSafeTileIndex: this.gameBoardManager.getSafeTileIndex,
            resetHightlightedTiles: this.gameBoardManager.resetHightlightedTiles,
            getIsPieceInDanger: this.gameBoardManager.getIsPieceInDanger,
            getIsTeamDamaged: this.gameBoardPiecesManager.getIsTeamDamaged,
            getPathToSafeTileAndAvoidEnemies: this.gameBoardManager.getPathToSafeTileAndAvoidEnemies,
            getPathToSafeTile: this.gameBoardManager.getPathToSafeTile,
            getPathToTeamLeader: this.gameBoardManager.getPathToTeamLeader,
            getPathFromTileToTile: this.gameBoardManager.getPathFromTileToTile,
            spawnDeathPieceAtLocation: this.gameBoardPiecesManager.spawnDeathPieceAtLocation,
            getDirFromTiles: this.gameBoardManager.getDirFromTiles,
            updateTileWithAbilityStatus: this.gameBoardManager.updateTileWithAbilityStatus,
            getPieceTileIndex: this.gameBoardPiecesManager.getPieceTileIndex,
            getMostDmgedTeammate: this.gameBoardPiecesManager.getMostDmgedTeammate,
            getPiece: this.gameBoardPiecesManager.getPiece,
            addPiece: this.gameBoardPiecesManager.addPiece,
            getTeamPieces: this.gameBoardPiecesManager.getTeamPieces,
            getPieceTeamIndex: this.gameBoardPiecesManager.getPieceTeamIndex,
            getOtherTeamsPieces: this.gameBoardPiecesManager.getOtherTeamsPieces,
            getTeamLeaderPiece: this.gameBoardPiecesManager.getTeamLeaderPiece,
        });
    }

    // FUTURE FEATURE: "ZOOM MANAGER"
    zoomInToTile(zoomTile, desiredZoomOutInNumTilesFromZoomTile) { }
    resetZoom() {
        this.zoomLvl = ZoomLvl.NoZoom;
    }
    // - - - - - - - - - - - - -
}