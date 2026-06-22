import { TileContender } from 'Game/DataClasses/GameBoard/Tile/TileContender';
import {
    TILE_DIRS,
    TILE_DIR_NORM_VECS,
    TILE_DIR_ROTATIONS_IN_DEGREES,
    ICON_ROTATION_METHODS
} from 'Utils/gameState';
import { getRandomIntInRange } from 'Game/utils'

export class GameBoardTile {
    constructor({
        tileIndex = { i: 0, j: 0 },
        isVisible = true,
        tileLocation = { x: 0, y: 0 },
        zIndex = 0,
        scale = 1,
        isHighlighted = false,
        tileStatus = undefined,
        contenders = {},
        currCount = 0,
        targetIndex = -1,
        teamIndex = -1,
        dirs = [],
        dmgMultiplier = 1,
        updateKey = 0,
        gameManagerProxy
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

        this.contenders = contenders;

        // per-tile status info
        this.currCount = currCount;
        this.targetIndex = targetIndex;
        this.teamIndex = teamIndex;
        this.dirs = dirs;
        this.dmgMultiplier = dmgMultiplier;

        // stored accTime of last tileStatus update
        this.updateKey = updateKey;

        this.gameManagerProxy = gameManagerProxy;
    }

    getAngleOfRotationFromTileDirs() {
        const dirs = this.dirs;
        const normVecs = dirs.map(d => {
            const i = TILE_DIRS.indexOf(d)
            if (i != -1) {
                return TILE_DIR_NORM_VECS[i];
            } else {
                return null;
            }
        });
        const accNormVec = normVecs.filter(v => !!v).reduce((acc, item) => {
            acc.x += item.x;
            acc.y += item.y;
            return acc;
        }, { x: 0, y: 0 });

        const avgNormVec = { x: accNormVec.x / dirs.length, y: accNormVec.y / dirs.length };

        // Math.cos(avgNormVec.x) // faster way to determine angle from norm vec: x/y?
        // Math.sin(avgNormVec.y)
        const indexOfClosestDir = TILE_DIR_NORM_VECS.reduce((acc, item, i) => {
            const dot = (item.x * avgNormVec.x) + (item.y * avgNormVec.y) / 2
            if (dot > acc.largestDot)
                return { largestDot: dot, i };
            return acc;
        }, { largestDot: -1, i: -1 }).i;

        if (indexOfClosestDir != -1)
            return TILE_DIR_ROTATIONS_IN_DEGREES[indexOfClosestDir]
        else
            return 0;
    };

    getAppliedStatus() {
        return this.tileStatus ? this.tileStatus.getAppliedStatus() : ''
    }

    getColor() {
        return this.tileStatus ? this.tileStatus.getColor() : ''
    }

    getRotation() {
        if (!!this.tileStatus) {
            // each tile icon uses the dirs rotation in a different way (sometimes overwriting it)
            const perIconRotation = ICON_ROTATION_METHODS[this.tileStatus.getRotationShift()]
            const rotation = perIconRotation(this.getAngleOfRotationFromTileDirs());
            return rotation;
        }
        return 0;
    }

    getRotationShift() {
        return this.tileStatus ? this.tileStatus.getRotationShift() : ''
    }

    getActiveIcon() {
        return this.tileStatus ? this.tileStatus.getActiveIcon() : ''
    }

    getIsVisible() {
        return this.isVisible;
    }

    getIsHighlighted() {
        return this.isHighlighted;
    }

    getZIndex() {
        return this.zIndex;
        // return this.gameManagerProxy.getFlattenedArrayIndex(this.tileIndex);
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

    setIsHighlighted(isHighlighted) {
        this.isHighlighted = isHighlighted;
    }

    getIsDmgTile(teamIndex) {
        if (!this.tileStatus) return 0;
        const dmg = this.tileStatus.getDmgAmt();
        const isDmg = this.teamIndex != teamIndex && dmg > 0;
        const isHeal = this.teamIndex == teamIndex && dmg < 0;
        return isHeal || isDmg;
    }

    getDmgAmt() {
        const dmg = this.tileStatus.getDmgAmt();
        // only apply the 'dmgMultiplier' to dmg (and not heals...)
        return dmg > 0 ? dmg * this.dmgMultiplier : dmg;
    }

    getContenders() {
        return this.contenders;
    }

    setContenders(contenders) {
        this.contenders = contenders;
    }

    addContender(key, contender) {
        this.contenders[key] = contender;
    }

    clearContenders() {
        this.contenders = {};
    }

    getTileStatus() {
        return this.tileStatus;
    }

    clearTileStatus() {
        this.tileStatus = undefined;

        this.currCount = 0;
        this.targetIndex = -1;
        this.teamIndex = -1;
        this.dirs = [];
    }

    getCurrCount() {
        return this.currCount;
    }

    setUpdateKey(updateKey) {
        this.updateKey = updateKey;
    }

    setTileStatus(tileStatus) {
        this.tileStatus = tileStatus;
    }

    getDirs() {
        return this.dirs;
    }

    updateTileStatus({ updateKey, tileStatus, currCount, dirs, teamIndex, targetIndex }) {
        this.setUpdateKey(updateKey);
        this.setTileStatus(tileStatus);

        this.currCount = currCount;
        this.dirs = dirs;
        this.teamIndex = teamIndex;
        this.targetIndex = targetIndex;
    }

    setClickedTile() {
        this.gameManagerProxy.updatePlayerDestinationFromClick(this.tileIndex);
     }

    getTileContenderFromTile({ currCount, newDirs }) {
        const newContender = new TileContender({
            tileStatus: this.tileStatus,
            currCount: currCount || Math.max(this.currCount - 1, 0), // SIDE EFFECT: decrement count
            targetIndex: this.targetIndex,
            teamIndex: this.teamIndex,
            dirs: newDirs || this.dirs
        });
        return newContender;
    }

    resolveContendersAndSetNewTileStatus() {
        // init winning appliedStatus "tracker"
        const contendersTracker = Object.keys(this.contenders).reduce((acc, k) => {
            acc[k] = true;
            return acc;
        }, {});

        Object.values(this.contenders).forEach(c => {
            const tileStatus = c.getTileStatus();
            const otherStatusesThisStatusBeats = tileStatus.getBeats();
            Object.keys(otherStatusesThisStatusBeats).forEach(otherStatus => {
                /*
                    for each contender status,
                    check which status (if any) is not cancelled-out by another contender status

                    NOTE: this only works if a tile status never "beats" itself... otherwise it will always cancel out itself
                */
                if (otherStatus in contendersTracker) {
                    contendersTracker[otherStatus] = false;
                }
            })
        });

        const winners = Object.entries(contendersTracker).filter(([_, v]) => !!v).map((k, _) => k);
        let i = 0;
        if (!winners.length) {
            this.clearTileStatus();
        } else {
            if (winners.length > 1) {
                // Pick random winner if more than one
                i = getRandomIntInRange({ max: winners.length - 1 });
            }
            const [winningAppliedStatus, _] = winners[i];
            const winningContender = this.contenders[winningAppliedStatus];
            this.updateTileStatus({ updateKey: this.updateKey, ...winningContender.getTileStatusValues() });
        }
    }
}