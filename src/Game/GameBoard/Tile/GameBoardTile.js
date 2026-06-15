export class GameBoardTile {
    constructor({
        tileIndex = { i: 0, j: 0 },
        isVisible = true,
        tileLocation = { x: 0, y: 0 },
        zIndex = 0,
        scale = 1,
        isHighlighted = false,
        tileStatus = undefined,
        contenderTiles = [], // adjacent tile indices that want to add their tileStatus to this tile
        currCount = 0,
        targetIndex = -1,
        teamIndex = -1,
        dirs = [],
        dmgMultiplier = 1,
        updateKey = 0
    }) {

        // CACHED ON INIT - - - - - - - -
        // { i, j } // i = col, j = row
        this.tileIndex = tileIndex;

        this.isVisible = isVisible; // ** may update with "Zoom feature"

        // 'getTileXAndY'
        this.tileLocation = tileLocation; // ** may update with "Zoom feature"

        // = i + j + rowLength
        this.zIndex = zIndex;
        this.key = zIndex;

        this.scale = scale;  // ** may update with "Zoom feature"
        // - - - - - - - - - - - - - - - -

        this.isHighlighted = isHighlighted; // replaces: 'isHighlighted0'

        // CLASS: 'GameBoardTileStatusAndAbilityData' (shared "flyweight" instances)
        this.tileStatus = tileStatus;

        // List of adjacent tile indices that have statuses that want to move into this tile
        this.contenderTiles = contenderTiles;

        // per-tile status info
        this.currCount = currCount;
        this.targetIndex = targetIndex;
        this.teamIndex = teamIndex;
        this.dirs = dirs;
        this.dmgMultiplier = dmgMultiplier;

        // stored accTime of last tileStatus update
        this.updateKey = updateKey;
    }

    updateIsVisible(isVisible) {
        this.isVisible = isVisible;
    }

    updateTileLocation(tileLocation) {
        this.tileLocation = tileLocation;
    }

    updateScale(scale) {
        this.scale = scale;
    }

    updateIsHighlighted(isHighlighted) {
        this.isHighlighted = isHighlighted;
    }

    getIsDmgTile(teamIndex) {
        const dmg = this.tileStatus.getDmg();
        const isDmg = this.teamIndex != teamIndex && dmg > 0;
        const isHeal = this.teamIndex == teamIndex && dmg < 0;
        return isHeal || isDmg;
    }

    getDmgAmt() {
        const dmg = this.tileStatus.getDmgAmt();
        // only apply the 'dmgMultiplier' to dmg (and not heals...)
        return dmg > 0 ? dmg * this.dmgMultiplier : dmg;
    }

    getContenderTiles() {
        return this.contenderTiles;
    }

    setContenderTiles(contenderTiles) {
        this.contenderTiles = contenderTiles;
    }

    addContenderTile(contenderTile) {
        this.contenderTiles.push(contenderTile);
    }

    clearContenderTiles() {
        this.contenderTiles = [];
    }

    getTileStatus() {
        return this.tileStatus;
    }

    setUpdateKey(updateKey) {
        this.updateKey = updateKey;
    }

    setTileStatus(tileStatus) {
        this.tileStatus = tileStatus;
    }

    updateTileStatus({ updateKey, tileStatus, currCount, dirs, teamIndex, targetIndex }) {
        this.setUpdateKey(updateKey);
        this.setTileStatus(tileStatus);

        this.currCount = currCount;
        this.dirs = dirs;
        this.teamIndex = teamIndex;
        this.targetIndex = targetIndex;
    }

    setClickedTile() { }
}