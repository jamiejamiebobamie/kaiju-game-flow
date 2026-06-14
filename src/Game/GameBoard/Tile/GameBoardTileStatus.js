export class GameBoardTileStatus {
    constructor({
        key,
        beats={}, // status key lookup. tracks which statuses the current status wins against
        totalCount = 0,
        bounceCountResetVal = 0,
        isPersistent = 0,
        dmgAmt = 1,
        isBouncy = false,
        bounceLogic = undefined, // TO-DO...
        isLeaveTrail = false,
        isRotating = [/* example: { tickFrom: 3, tickTo: 6 } */],
        isConserveDirections = [/* example: { tickFrom: 3, tickTo: 6 } */],
        isTracking = [/* example: { tickFrom: 3, tickTo: 6 } */],
        isSpread = [/* example: { tick: 3, dirs: [1-6] } */],
        isReverseDirection = [/* example, tick(s): 3, 4, 5 */]
    }) {
        this.key = key;
        this.beats = beats;
        this.totalCount = totalCount;
        this.bounceCountResetVal = bounceCountResetVal;
        this.isPersistent = isPersistent;
        this.dmgAmt = dmgAmt;
        this.isBouncy = isBouncy;
        this.bounceLogic = bounceLogic;
        this.isLeaveTrail = isLeaveTrail;
        this.isRotating = isRotating;
        this.isConserveDirections = isConserveDirections;
        this.isTracking = isTracking;
        this.isSpread = isSpread;
        this.isReverseDirection = isReverseDirection;
    }

    updateTotalCount(totalCount) {
        this.totalCount = totalCount;
    }

    updateIsPersistent(isPersistent) {
        this.isPersistent = isPersistent;
    }

    updateIsBouncy(isBouncy) {
        this.isBouncy = isBouncy;
    }

    updateIsLeaveTrail(isLeaveTrail) {
        this.isLeaveTrail = isLeaveTrail;
    }

    updateIsRotating(ticks) {
        this.isRotating = ticks.map(([tickStart, tickEnd]) => ({ tickStart, tickEnd }));
    }

    updateIsConserveDirections(ticks) {
        this.isConserveDirections = ticks.map(([tickStart, tickEnd]) => ({ tickStart, tickEnd }));
    }

    updateIsTracking(ticks) {
        this.isTracking = ticks.map(([tickStart, tickEnd]) => ({ tickStart, tickEnd }));
    }

    updateIsSpread(ticks) {
        this.isSpread = ticks.map(([triggerTick, dirs]) => ({ triggerTick, dirs }));
    }

    updateIsReverseDirection(triggerTicks) {
        this.isReverseDirection = triggerTicks;
    }

    updateDmgAmt(dmgAmt){
        this.dmgAmt = dmgAmt;
    }

    getDmgAmt(){
        return this.dmgAmt;
    }

    getBeats(){
        return this.beats;
    }
}