export class TileContender {
    constructor({
        tileStatus,
        currCount,
        targetIndex,
        teamIndex,
        dirs
    }) {
        // CLASS: 'GameBoardTileStatusAndAbilityData' (shared "flyweight" instances)
        this.tileStatus = tileStatus;

        // per-tile status info
        this.currCount = currCount;
        this.targetIndex = targetIndex;
        this.teamIndex = teamIndex;
        this.dirs = dirs;
    }

    getKey(iterCount) {
        // TO-DO: check sort strings method 'compareLocale'...
        return `${this.tileStatus.getAppliedStatus()} ${this.currCount} ${this.targetIndex} ${this.teamIndex} ${this.dirs.length ? this.dirs.sort((a, b) => a - b).join("") : '_'} ${iterCount}`
    }

    getTileStatus() {
        return this.tileStatus;
    }

    getAppliedStatus() {
        return this.tileStatus.getAppliedStatus();
    }

    mergeSameStatusContenders(tileContender) {
        // accumulate
        this.currCount += tileContender.currCount;
        this.dirs = Array.from(new Set(...this.dirs, ...tileContender.dirs));
        if (Math.random() > .5) {
            // overwrite...
            this.targetIndex = tileContender.targetIndex;
            this.teamIndex = tileContender.teamIndex;
        }
    }

    getTileStatusValues() {
        return {
            tileStatus: this.tileStatus,
            currCount: this.currCount,
            targetIndex: this.targetIndex,
            teamIndex: this.teamIndex,
            dirs: this.dirs
        }
    }
}