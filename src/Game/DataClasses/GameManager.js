import { GameMode, ZoomLvl } from 'Utils/gameState';
import { TimeoutHandler } from './TimeoutHandler';
import { GameManagerProxy } from './GameManagerProxy';
import { PlayerInputHandler } from './PlayerInputHandler';
import { SettingsManager } from './SettingsManager';
import { GameBoardPiecesManager } from './GameBoard/Pieces/GameBoardPiecesManager';
import { KaijuManager } from './KaijuManager';
import { GameBoardManager } from './GameBoard/GameBoardManager';

export class GameManager {
    constructor({ scale, settingsManager }) {
        this.zoomLvl = ZoomLvl.NoZoom;
        this.score = 0;
        this.isPaused = false;
        this.tutorialIndex = 0;
        this.settingsManager = !!settingsManager ? settingsManager : new SettingsManager();
        this.timeoutHandler = new TimeoutHandler();
        this.gameManagerProxy = new GameManagerProxy();
        this.playerInputHandler = new PlayerInputHandler({ gameManagerProxy: this.gameManagerProxy });
        this.gameBoardPiecesManager = new GameBoardPiecesManager({ gameManagerProxy: this.gameManagerProxy });
        this.gameBoardManager = new GameBoardManager({ gameManagerProxy: this.gameManagerProxy, scale });
        this.kaijuManager = new KaijuManager({ gameManagerProxy: this.gameManagerProxy });
    }

    getIsPaused = () => {
        return this.isPaused;
    }

    getPlayerInputHandler() {
        return this.playerInputHandler;
    }

    getTiles() {
        return this.gameBoardManager.getTilesInFlatArray();
    }

    getPieceColorsLookup() {
        return this.gameBoardPiecesManager.getPieceColorsLookup();
    }

    getPieces() {
        return this.gameBoardPiecesManager.getPieces();
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

        // player abilities to input handler to be triggered by keyboard keys
        playerAbilities.forEach(a => this.playerInputHandler.addPlayerAbilities(a));

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
            const teammateAvatar = playerAvatar == 'guy' ? 'girl' : 'guy'; // TO-DO: hook this up to selection screen...
            for (let i = 0; i < 4; i++) {
                const teammateAbilities = this.settingsManager.getThreeRandomAbilities();

                // add teammate abilities to input handler to be triggered by keyboard keys
                teammateAbilities.forEach(a => this.playerInputHandler.addPlayerAbilities(a));

                const cyberPunks = [
                    // teammateAvatar,
                    // 'rival_guy',
                    // 'rival_girl',
                    'agent',
                    'agent',
                    'agent',
                    'agent'
                ];

                // add teammate
                this.gameBoardPiecesManager.addTeammate({ teammateAvatar: cyberPunks[i], teammateAbilities });
            }
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

    updateTileState(accTime) {
        this.gameBoardManager.updateTileState(accTime);
    }

    getIsGameOver() {
        const isSomeAlive = this.gameBoardPiecesManager.getIsSomePiecesAlive();
        if (!isSomeAlive) return true; // GAME OVER

        const isOnlyOneTeamStillAlive = this.gameBoardPiecesManager.getIsAllLivingPiecesFromOneTeam();
        return isOnlyOneTeamStillAlive; // GAME OVER
    }

    // TEST
    testBounds() {
        this.gameBoardManager.updateBounds({ newBounds: this.gameBoardManager.bounds == 2 ? 'Lookup' : 'Grid' });
        this.gameBoardManager.initTiles();
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

    togglePauseGame = (accTime) => {
        this.isPaused = !this.isPaused;
        // TO-DO: Fix!

        // if (this.isPaused) {
        //     this.timeoutHandler.pauseTimeouts(accTime);
        // } else {
        //     this.timeoutHandler.restartTimeouts(accTime);
        // }
    }

    resetGame() {
        this.score = 0;
        this.timeoutHandler.reset();
        this.gameBoardPiecesManager.resetPieces();
        this.kaijuManager.setKaijuCount(0);
        this.gameBoardManager.resetTiles();
        this.playerInputHandler.resetPlayerAbilities();
    }

    updateProxyProps = () => {
        this.gameManagerProxy.updateProps({
            updateScore: this.updateScore,
            registerTimeout: this.timeoutHandler.registerTimeout,
            unregisterTimeout: this.timeoutHandler.unregisterTimeout,
            getAbilityAndTileStatusData: this.settingsManager.getAbilityAndTileStatusData,
            getKaijuAbilities: this.settingsManager.getKaijuAbilities,
            determineKaijuDetails: () => this.kaijuManager.determineKaijuDetailsFromDifficulty(this.settingsManager.getDifficulty()),
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
            getHighlightedTiles: this.gameBoardManager.getHighlightedTiles,
            getClickedTileIndex: this.gameBoardManager.getClickedTileIndex,
            getHoveredTileIndex: this.gameBoardManager.getHoveredTileIndex,
            setClickedTileIndex: this.gameBoardManager.setClickedTileIndex,
            setHoveredTileIndex: this.gameBoardManager.setHoveredTileIndex,
            getIsPieceInDanger: this.gameBoardManager.getIsPieceInDanger,
            getIsTeamDamaged: this.gameBoardPiecesManager.getIsTeamDamaged,
            getPlayerPiece: this.gameBoardPiecesManager.getPlayerPiece,
            findPathFromTo: this.gameBoardManager.findPathFromTo,
            getPathToSafeTileAndAvoidEnemies: this.gameBoardManager.getPathToSafeTileAndAvoidEnemies,
            getPathToSafeTile: this.gameBoardManager.getPathToSafeTile,
            clearClickedTileIndex: this.gameBoardManager.clearClickedTileIndex,
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