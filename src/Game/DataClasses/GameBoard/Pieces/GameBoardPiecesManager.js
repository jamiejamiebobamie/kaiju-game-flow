import { PIECES_INFO } from 'Utils/gameState';
import { GameBoardPieceBase } from './GameBoardPieceBase';
import { Team } from './Team';

export class GameBoardPiecesManager {
    constructor({ gameManagerProxy }) {
        this.pieces = [];
        this.deathPieces = [];
        this.teams = [];
        this.gameManagerProxy = gameManagerProxy;
    }

    getPlayerPiece = () => {
        const player = this.pieces[0];
        return player;
    }

    getPiece = (pieceIndex) => {
        const piece = this.pieces[pieceIndex];
        return piece;
    }

    getPieces() {
        return this.pieces;
    }

    getMostDmgedTeammate(pieceIndex) {

        const teamIndex = this.pieces[pieceIndex].teamIndex;
        const teammateIndices = this.teams[teamIndex].getTeamPiecesIndices();

        let mostDmgedTeammateIndex = pieceIndex;
        let lowestHealth = this.pieces[pieceIndex].getLives();

        teammateIndices.forEach(i => {
            const test = this.pieces[i].getLives();
            if (lowestHealth > test) {
                lowestHealth = test;
                mostDmgedTeammateIndex = i;
            }
        })

        return this.pieces[mostDmgedTeammateIndex];
    }

    getPieceTileIndex = (pieceIndex) => {
        const pieceTileIndex = this.pieces[pieceIndex].tileIndex;
        return pieceTileIndex;
    }

    getPlayerTeamIndex() {
        const playerTeamIndex = this.pieces[0].getTeamIndex();
        return playerTeamIndex;
    }

    getPieceTeamIndex = (pieceIndex) => {
        const teamIndex = this.pieces[pieceIndex].getTeamIndex();
        return teamIndex;
    }

    initPlayerLocationsOnBoard() {
        const isOnTiles = true;
        this.pieces.forEach(p => p.initCharLocation(isOnTiles));
    }

    getTeamLeaderPiece = (pieceIndex) => {
        const teamIndex = this.pieces[pieceIndex].getTeamIndex();
        const leaderPieceIndex = this.teams[teamIndex].getTeamLeaderIndex();
        const leaderPiece = this.pieces[leaderPieceIndex];
        return leaderPiece;
    }

    getIsAllLivingPiecesFromOneTeam() {
        let winningTeamIndex = -1;
        const isOnlyOneTeamStanding = this.pieces.every(piece => {

            // do not consider dead pieces.
            if (piece.isDead)
                return true;

            /*
                init 'winningTeamIndex.'
                continue to next living piece...
            */
            if (winningTeamIndex == -1) {
                winningTeamIndex = piece.teamIndex;
                return true;

                /*
                    every living piece's teamIndex must equal the 'winningTeamIndex.'
                */
            } else {
                const isOnlyOneTeamAlive = piece.teamIndex == winningTeamIndex;
                return isOnlyOneTeamAlive;
            }
        });
        return isOnlyOneTeamStanding;
    }

    getIsSomePiecesAlive() {
        const isSomeAlive = this.pieces.some(({ isDead }) => !isDead);
        return isSomeAlive;
    }

    movePieces({ accTime, timeoutHandler, playerInputHandler }) {
        this.pieces.forEach(p => p.movePiece({ accTime, timeoutHandler, playerInputHandler }));
    }

    addPlayer({ playerAvatar, playerAbilities }) {
        const pieceInfo = { ...PIECES_INFO[playerAvatar], isNpc: false, abilities: playerAbilities };
        this.addPiece({ pieceInfo });
    }

    addTeammate({ teammateAvatar, teammateAbilities }) {
        const pieceInfo = { ...PIECES_INFO[teammateAvatar], abilities: teammateAbilities };
        this.addPiece({ pieceInfo });
    }

    getTeamPieces = (teamIndex) => {
        const teamPiecesIndices = this.teams[teamIndex].getTeamPiecesIndices();
        const teamPieces = teamPiecesIndices.map(pieceIndex => this.pieces[pieceIndex]);
        return teamPieces
    }

    spawnDeathPieceAtLocation = (charLocation, avatar, tileIndex, color) => {
        const zIndex = this.gameManagerProxy.getFlattenedArrayIndex(tileIndex);
        // TO-DO: make a DeathPiece class.
        const deathPiece = {}//new DeathPiece(charLocation, avatar, zIndex, color);
        this.deathPieces.push(deathPiece);
    }

    getIsTeamDamaged = (pieceIndex) => {
        const teamIndex = this.pieces[pieceIndex].teamIndex;
        const teammates = this.teams[teamIndex].teammateIndices;
        return teammates.some(pieceIndex => {
            const teammate = this.pieces[pieceIndex];
            return teammate.lives < teammate.maxLives;
        });
    }

    getOtherTeamsPieces = (pieceIndex) => {
        const teamIndex = this.pieces[pieceIndex].teamIndex;
        const otherTeamsPieces = this.pieces.filter(p => p.teamIndex != teamIndex);
        return otherTeamsPieces;
    }

    addTeam(pieceIndex) {
        const newTeam = new Team({ teamLeaderIndex: pieceIndex, teamIndex: this.teams.length, teammateIndices: [pieceIndex] });
        this.teams.push(newTeam);
    }

    removeTeam(teamIndex) {
        if (this.teams.some(t => t.teamIndex == teamIndex)) {
            this.teams.splice(teamIndex, 1);
        }
    }

    addPiece = ({ pieceClass = GameBoardPieceBase, pieceInfo, teamIndex = 0 }) => {
        const pieceIndex = this.pieces.length;

        const classInfo = { ...pieceInfo, pieceIndex, teamIndex, gameManagerProxy: this.gameManagerProxy };

        const newPiece = new pieceClass(classInfo);
        this.pieces.push(newPiece);

        // SIDE-EFFECT: create new Team if team does not exist
        if (!this.teams[teamIndex]) {
            this.addTeam(pieceIndex);
            newPiece.setIsTeamLeader(true);
        } else {
            this.teams[teamIndex].addTeammate(pieceIndex);
        }

        return newPiece;
    }

    removePiece(pieceIndex) {
        const removedPiece = this.pieces.splice(pieceIndex, 1);
        this.teams[removedPiece.teamIndex].removeTeammate(removedPiece.pieceIndex);
    }

    resetPieces() {
        this.pieces = [];
        this.teams = [];
        this.deathPieces = [];
    }
    getPieceColorsLookup() {
        // create lookup of tileindex string: '0 1' to GamePiece color for 'redrawTiles' method
        return this.pieces.filter(p => p.isOnTiles && !p.isDead).reduce((lookup, piece) => {
            lookup[`${piece.tileIndex.i} ${piece.tileIndex.j}`] = piece.getColor();
            return lookup;
        }, {});
    }
    // - - - - - - - - - -
}