// flyweight instance with constant data, shared between per-player instances of 'GameBoardPieceAbility'
export class GameBoardPieceAbilityData {
    constructor({
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
        statusApplied,
        isTriggerPassiveImmediately = true,
        modifierVal = 0,
        fieldToModify = '',
    }) {
        this.color = color;
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
        this.desiredAIRange = desiredAIRange;
        this.range = range;
        this.area = area;
        this.type = type;
        this.displayLookup = displayLookup;
        this.element = element;
        this.cooldownTimeAI = cooldownTimeAI;
        this.cooldownTimePlayer = cooldownTimePlayer;
        this.passiveDurationTime = passiveDurationTime;
        this.appliedStatus = appliedStatus;
        this.isTriggerPassiveImmediately = isTriggerPassiveImmediately;
        this.modifierVal = modifierVal;
        this.fieldToModify = fieldToModify;
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