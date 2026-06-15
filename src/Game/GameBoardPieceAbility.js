

export class GameBoardPieceAbility {
    constructor({
        accTime = 0,
        isPassiveApplied = false,
        isOnCooldown = false,
        toggleOffPassiveTimeoutRef = undefined, // TO-DO... handle this with timeout manager class...
        gameBoardPieceAbilityData = undefined // GameBoardTileStatusAndAbilityData
    }) {
        this.accTime = accTime;
        this.toggleOffPassiveTimeoutRef = toggleOffPassiveTimeoutRef;
        this.isPassiveApplied = isPassiveApplied;
        this.isOnCooldown = isOnCooldown;
        this.gameBoardPieceAbilityData = gameBoardPieceAbilityData;
    }

    useAbility({
        accTime,
        piece,
        registerTimeout,
        shootPower
    }) {
        // update accTime
        this.accTime = accTime;
        // activate teammate active ability
        shootPower({
            pieceIndex: piece.pieceIndex,
            appliedStatus: this.gameBoardPieceAbilityData.appliedStatus,
            accTime
        });
        const triggerPassive = () => {
            // toggle-on teammate passive ability
            this.gameBoardPieceAbilityData.togglePassive(piece);
            // toggle-off teammate passive ability
            const delay = this.gameBoardPieceAbilityData.passiveDurationTime ? this.gameBoardPieceAbilityData.passiveDurationTime : this.gameBoardPieceAbilityData.cooldownTimeAI;
            const toggleOffPassive = () => {
                const toggleOff = true;
                this.gameBoardPieceAbilityData.togglePassive(piece, toggleOff);
            }
            registerTimeout(accTime, toggleOffPassive, delay);
        }
        if (this.gameBoardPieceAbilityData.isTriggerPassiveImmediately) {
            triggerPassive();
        } else {
            return triggerPassive;
        }
    }

    getType() {
        return this.gameBoardPieceAbilityData.type;
    }

    getDesiredAIRange() {
        return this.gameBoardPieceAbilityData.desiredAIRange;
    }
}