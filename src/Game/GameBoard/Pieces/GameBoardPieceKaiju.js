import { GameBoardPieceBase } from './GameBoardPieceBase';

export class GameBoardPieceKaiju extends GameBoardPieceBase {
    constructor(params) {
        super(params);
        this.isGoingToSpewFire = false;
        this.spewFireCoolDown = params.spewFireCoolDown;
        this.isOnTiles = false;

        this.pieceClass = 'Kaiju!';
        this.pieceClassDescription = 'They come from the sea, at night!';
        this.elements = 'kaijuFire';

        
    }

    useAbilities(accTime) {
        if (!this.isOnTiles) return;

        const moveToTilesToEnemy = this.gameManagerProxy.getPathToClosestEnemy(this.pieceIndex);
        const numTilesToEnemy = moveToTilesToEnemy.length;

        this.abilities.forEach((a, i) => {
            const isCooldownOver =
                (((accTime - a.accTime) >= this.spewFireCoolDown) || (accTime < a.accTime));

            if (isCooldownOver) {

                const isOffensivePowerAndTargetInRange =
                    a.type.includes("offensive") &&
                    !!numTilesToEnemy &&
                    a.range >= numTilesToEnemy;
                if (isOffensivePowerAndTargetInRange) {
                    a.useAbility(
                        // TO-DO: determine required data...
                    );
                }
            } else {
                this.determineIfIsGoingToSpewFire(a, accTime);
            }
        });
    }

    determineIfIsGoingToSpewFire(a, accTime) {
        const { KAIJU_COOL_DOWN } = this.gameManagerProxy.determineKaijuDetailsFromDifficulty(difficulty);

        const showFireTime = a.accTime // last game time the fire was spewed
            + KAIJU_COOL_DOWN // a.cooldownTimeAI // fire spew cooldown (12 seconds)
            * 0.75; // show the fire after 3/4 of the cooldown time (9 seconds) 
        _data[i].isGoingToSpewFire = !a.accTime || accTime > showFireTime;
    }
}