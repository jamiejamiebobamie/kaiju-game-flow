import { Difficulty, PIECES_INFO } from 'Utils/gameState';
import { GameBoardPieceKaiju } from './GameBoard/Pieces/GameBoardPieceKaiju';

export class KaijuManager {
    constructor({
        gameManagerProxy,
        kaijuTeamIndex = 1
    }) {
        this.isKaiju = false;
        this.kaijuCount = 0;
        this.kaijuSpawnAccTime = 0;
        this.kaijuTeamIndex = kaijuTeamIndex;
        // - -
        // CONSIDER MAKING THIS DEPENDENT ON DIFFICULTY... 
        this.kaijuSpawnInterval = 12000;
        this.kaijuRespawnInterval = 3000;
        this.intialKaijuSpawnDelay = 7000;
        // - -

        this.gameManagerProxy = gameManagerProxy;
    }

    startKaijuSpawner = accTime => {
        const callback = (accTime) => {
            const { MAX_AT_ONCE } = this.gameManagerProxy.getKaijuAbilities();
            const isRespawn = this.kaijuCount >= MAX_AT_ONCE;
            const delay = this.kaijuCount + 1 >= MAX_AT_ONCE ? this.kaijuRespawnInterval : this.kaijuSpawnInterval;

            const newAccTime = accTime + delay;
            if (isRespawn) {
                const isRespawnSuccess = this.respawnKaiju(accTime);

                if (isRespawnSuccess) {
                    this.gameManagerProxy.registerTimeout(accTime, () => callback(newAccTime), delay)
                } else {
                    // wait one second and try again if no dead kaiju
                    this.gameManagerProxy.registerTimeout(accTime, () => callback(newAccTime), 1000);
                }

            } else {
                this.spawnNewKaiju(accTime);
                this.gameManagerProxy.registerTimeout(accTime, () => callback(newAccTime), delay)
            }
        }

        this.gameManagerProxy.registerTimeout(accTime, () => callback(accTime), this.intialKaijuSpawnDelay);
        this.isKaiju = true;
    }

    determineKaijuDetailsFromDifficulty = (difficulty) => {
        let MAX_AT_ONCE, MAX_TO_WIN, KAIJU_MAX_HEALTH, KAIJU_MAX_SPEED, KAIJU_COOL_DOWN = undefined;
        switch (difficulty) {
            case Difficulty.Easy:
                MAX_AT_ONCE = 2;
                MAX_TO_WIN = 5;
                KAIJU_MAX_HEALTH = 2;
                KAIJU_MAX_SPEED = 2;
                KAIJU_COOL_DOWN = 12000;
                break;
            case Difficulty.Hard:
                MAX_AT_ONCE = 4;
                MAX_TO_WIN = 20;
                KAIJU_MAX_HEALTH = 3;
                KAIJU_MAX_SPEED = 3;
                KAIJU_COOL_DOWN = 9000;
                break;
            case Difficulty.Xtreme:
                MAX_AT_ONCE = 5;
                MAX_TO_WIN = 50;
                KAIJU_MAX_HEALTH = 3;
                KAIJU_MAX_SPEED = 3;
                KAIJU_COOL_DOWN = 6000;
                break;
            default: // Difficulty.Medium
                MAX_AT_ONCE = 3;
                MAX_TO_WIN = 10;
                KAIJU_MAX_HEALTH = 3;
                KAIJU_MAX_SPEED = 2;
                KAIJU_COOL_DOWN = 12000;
        }
        return { MAX_AT_ONCE, MAX_TO_WIN, KAIJU_MAX_HEALTH, KAIJU_MAX_SPEED, KAIJU_COOL_DOWN };
    }

    getIsSpawnNewKaiju(accTime, spawnInterval) {
        return accTime >= (this.kaijuSpawnAccTime + spawnInterval);
    }

    spawnNewKaiju(accTime) {
        this.addKaijuPiece(accTime);
    }

    addKaijuPiece(accTime) {

        // TO-DO: consider making this set on init...
        const { KAIJU_MAX_HEALTH, KAIJU_MAX_SPEED, KAIJU_COOL_DOWN } = this.gameManagerProxy.getKaijuAbilities();

        const teamIndex = this.kaijuTeamIndex;
        const pieceInfo = {
            ...PIECES_INFO['kaiju'],
            abilities: this.gameManagerProxy.getKaijuAbilities(),
            spewFireCoolDown: KAIJU_COOL_DOWN,
            maxLives: KAIJU_MAX_HEALTH,
            moveSpeed: KAIJU_MAX_SPEED,
            isDoAvoidEnemy: false,
        };

        const newKaiju = this.gameManagerProxy.addPiece({ pieceInfo, teamIndex, pieceClass: GameBoardPieceKaiju })
        newKaiju.initCharLocation();
        this.kaijuCount += 1;
        this.kaijuSpawnAccTime = accTime;
    }

    respawnKaiju(accTime) {
        const kaijuPieces = this.gameManagerProxy.getTeamPieces(this.kaijuTeamIndex);
        const deadKaijuPiece = kaijuPieces.find(piece => piece.getIsDead());

        if (!!deadKaijuPiece) {
            deadKaijuPiece.respawn(accTime);
            this.kaijuSpawnAccTime = accTime;
            const isRespawnSuccess = true;
            return isRespawnSuccess;
        }
    }

    setKaijuCount(kaijuCount) {
        this.kaijuCount = kaijuCount;
    }

    getIsKaiju() {
        return this.isKaiju;
    }
}