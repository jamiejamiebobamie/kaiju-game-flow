export class PlayerInputHandler {
    constructor({ gameManagerProxy }) {
        this.pressedKeys = [];
        this.isMovementKeyInput = false;

        this.gameManagerProxy = gameManagerProxy;
    }

    addKey(code) {
        this.pressedKeys = !this.pressedKeys.includes(code) ? [...this.pressedKeys, code] : this.pressedKeys;
    }

    removeKey(code) {
        this.pressedKeys = this.pressedKeys.includes(code) ? this.pressedKeys.filter(k => k != code) : this.pressedKeys;
    }

    getDirFromPlayerInput(tileIndex) {
        const keys = this.pressedKeys;

        if (this.pressedKeys.length) return 'idle';

        const sortLookup = {
            "KeyW": 0, "KeyS": 1, "KeyA": 2, "KeyD": 3,
            "ArrowUp": 0, "ArrowDown": 1, "ArrowLeft": 2, "ArrowRight": 3
        };

        const dirLookup = {
            "KeyW": "up", "KeyA": "left", "KeyS": "down", "KeyD": "right",
            "ArrowUp": "up", "ArrowLeft": "left", "ArrowDown": "down", "ArrowRight": "right"
        };

        const dirs = keys
            // sort based on priority
            .sort((a, b) => sortLookup[a] - sortLookup[b])
            // map keys to directions
            .map(k => dirLookup[k])
            // remove duplicates in case of Arrow Keys and WASD are pressed at same time
            .reduce((acc, item) => !acc.includes(item) ? [...acc, item] : acc, []);

        let dir = dirs[0];
        if (dirs.length > 1) {
            const isConflictingDirs = (dirs.includes("up") && dirs.includes("down")) || (dirs.includes("left") && dirs.includes("right"));
            if (isConflictingDirs) {
                dir = dirs[0];
            } else {
                dir = `${dirs[0]} ${dirs[1]}`;
            }
        }

        if (!!tileIndex) {
            if (dir == "right" || dir == "left") {
                /*
                  handle left-right movement on hexagonal grid.
                  prefix "up " or "down " depending on
                    column index of current player tile.
                */
                const { j } = tileIndex;
                if (j % 2) {
                    dir = `up ${dir}`;
                } else {
                    dir = `down ${dir}`;
                }
            }
        }
        return dir;
    }

    convertWasdDirToAnimationDir(wasdDir) {
        return wasdDir.split(" ").reduce((acc, item) => !acc ? item : acc + item[0].toUpperCase() + item.slice(1), '');
    }

    getIsPastPlayerInput() {
        const isPastPlayerInput = this.isMovementKeyInput;
        return isPastPlayerInput;
    }

    setIsPastPlayerInput(isPastPlayerInput) {
        this.isMovementKeyInput = !!isPastPlayerInput;
    }

    getIsCurrentPlayerInput() {
        const isCurrentPlayerInput = !!this.pressedKeys.length
        return isCurrentPlayerInput;
    }

    getIsChangeOfDirection(dir, tileIndex) {
        const isChangeOfDirection = dir != this.convertWasdDirToAnimationDir(this.getDirFromPlayerInput(tileIndex));
        return isChangeOfDirection;
    }

    updatePlayerDestinationFromClick(clickedTileIndex) {
        if(!clickedTileIndex) return;
        const player = this.gameManagerProxy.getPlayerPiece();
        const playerTileIndex = player.getTileIndex();
        const moveToTiles = this.gameManagerProxy.findPathFromTo({ from: playerTileIndex, to: clickedTileIndex });
        player.updateMovmement(moveToTiles);
    }

    updateHighlightedTilesFromPlayerHover(hoveredTileIndex) {
        const player = this.gameManagerProxy.getPlayerPiece();
        if (!hoveredTileIndex) {
            if (player.getIsMoving()) {
                this.gameManagerProxy.setHightlightedTiles(player.getMoveToTiles());
            }
            else if (this.gameManagerProxy.getIsHightlightedTiles()) {
                this.gameManagerProxy.resetHightlightedTiles();
            }
        } else {
            const playerTileIndex = player.getTileIndex();
            const moveToTiles = this.gameManagerProxy.findPathFromTo({ from: playerTileIndex, to: hoveredTileIndex });
            this.gameManagerProxy.setHightlightedTiles(moveToTiles);
        }
    }
}
