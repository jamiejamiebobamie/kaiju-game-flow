// FLYWEIGHT
export class GameBoardTileStatusAndAbilityData {
    constructor({
        beats = {}, // status key lookup. tracks which statuses the current status wins against
        bounceCountResetVal = 0,
        isPersistent = true,
        dmgAmt = 1,
        isBouncy = false,
        bounceLogic = undefined, // TO-DO...
        isLeaveTrail = false,
        isRotating = [/* example: { tickFrom: 3, tickTo: 6 } */],
        isConserveDirections = [/* example: { tickFrom: 3, tickTo: 6 } */],
        isTracking = [/* example: { tickFrom: 3, tickTo: 6 } */],
        isSpread = [/* example: { tick: 3, dirs: [1-6] } */],
        isReverseDirection = [/* example, tick(s): 3, 4, 5 */],
        color,
        passiveName,
        activeName,
        passiveIcon,
        activeIcon,
        passiveDesc,
        activeDesc,
        passiveEffect1,
        passiveEffect2,
        activeEffect1,
        activeEffect2,
        desiredAIRange,
        range,
        area,
        type,
        displayLookup,
        element,
        cooldownTimeAI,
        cooldownTimePlayer,
        passiveDurationTime,
        appliedStatus,
        isTriggerPassiveImmediately = true,
        modifierVal = 0,
        fieldToModify = '',
        rotationShift = 'doNotRotate' // method name to apply to tile status icon to handle status icon rotation on tile
    }) {
        this.appliedStatus = appliedStatus;

        this.range = range; // tileCount / totalCount / startCount / count
        this.area = area; // numTiles
        this.dmgAmt = dmgAmt;

        this.beats = beats;

        // BOOLEANS
        this.isPersistent = isPersistent;
        this.isBouncy = isBouncy;
        this.isLeaveTrail = isLeaveTrail;
        // - - - -

        this.bounceCountResetVal = bounceCountResetVal;
        this.bounceLogic = bounceLogic;

        // TICK RANGES
        this.isRotating = isRotating;
        this.isConserveDirections = isConserveDirections;
        this.isTracking = isTracking;
        // - - - -

        // TICK EVENTS
        this.isSpread = isSpread;
        this.isReverseDirection = isReverseDirection;
        // - - - -

        // status color
        this.color = color;

        // ability UI data
        this.passiveName = passiveName;
        this.activeName = activeName;
        this.passiveIcon = passiveIcon;
        this.activeIcon = activeIcon;
        this.passiveDesc = passiveDesc;
        this.activeDesc = activeDesc;
        this.passiveEffect1 = passiveEffect1;
        this.passiveEffect2 = passiveEffect2;
        this.activeEffect1 = activeEffect1;
        this.activeEffect2 = activeEffect2;
        this.displayLookup = displayLookup; // example: "abilityGlass"
        this.element = element; // 'glass'
        this.rotationShift = rotationShift; // method name to apply to tile status icon to handle status icon rotation on tile

        // NPC AI
        this.desiredAIRange = desiredAIRange; // ideal number of tiles away from enemy given ability
        this.type = type; // array of ability types: 'offensive', 'defensive', 'escape', 'heal'
        this.cooldownTimeAI = cooldownTimeAI;
        // - - - 

        this.cooldownTimePlayer = cooldownTimePlayer;

        // PASSIVE ability
        this.passiveDurationTime = passiveDurationTime;
        this.isTriggerPassiveImmediately = isTriggerPassiveImmediately;
        this.modifierVal = modifierVal;
        this.fieldToModify = fieldToModify;
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

    updateDmgAmt(dmgAmt) {
        this.dmgAmt = dmgAmt;
    }

    getDmgAmt() {
        return this.dmgAmt;
    }

    getBeats() {
        return this.beats;
    }

    getElementUppercase() {
        return this.element[0].toUpperCase() + this.element.slice(1);
    }

    togglePassive(piece, toggleOff) {
        modifyStats(piece, toggleOff);
    }

    modifyStats(piece, toggleOff) {
        const mod = (toggleOff ? -1 : 1) * this.modifierVal;
        const modification = piece[this.fieldToModify] + mod;
        piece[this.fieldToModify] = modification;
    };
}