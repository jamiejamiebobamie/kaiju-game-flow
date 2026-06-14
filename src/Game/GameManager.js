import { Bounds, PENINSULA_TILE_LOOKUP, Difficulty, GameMode, ZoomLvl, MAX_ROWS, MAX_COLS } from 'Utils/gameState';
import { TimeoutHandler } from './TimeoutHandler';
import { GameManagerProxy } from './GameManagerProxy';
import { PlayerInputHandler } from './PlayerInputHandler';

export class GameManager {
    constructor({ scale }) {
        this.pieces = [];
        this.deathPieces = [];
        this.teams = [];
        this.tiles = [[]]; // per tile (unique 'i' and 'j') rendering and tile status info
        this.numTileColumns = MAX_COLS;
        this.numTileRows = MAX_ROWS;
        this.abilitiesData = []; // FLYWEIGHT of ~11 abilities...
        this.tileStatuses = []; // FLYWEIGHT of ~11 statuses...
        this.score = 0;
        this.highlightedTiles = [];
        this.isTutorial = false;
        this.isGame = false;
        this.isSettings = false;
        this.tutorialIndex = 0;
        this.isPaused = false;
        this.isRenderTiles = true;
        this.isRenderMap = true;
        this.isKaiju = true;
        this.kaijuCount = 0;
        this.kaijuSpawnAccTime = 0;
        this.kaijuTeamIndex = 1;
        // - -
        // CONSIDER MAKING THIS DEPENDENT ON DIFFICULTY... 
        this.kaijuSpawnInterval = 12000;
        this.kaijuRespawnInterval = 3000;
        this.maxKaijuAtOnce = 5; // TO-DO: need to set this with the correct value on init...
        // - -
        this.scale = scale;
        this.gameMode = GameMode.Story;
        this.zoomLvl = ZoomLvl.NoZoom;
        this.timeoutHandler = new TimeoutHandler();
        this.bounds = Bounds.Lookup;
        this.boundsLookup = PENINSULA_TILE_LOOKUP;
        this.gameManagerProxy = new GameManagerProxy();
        this.playerInputHandler = new PlayerInputHandler();
        this.difficulty = Difficulty.Medium;
        this.playerAvatar = 'guy';
    }

    // GAME MANAGER - - - - - - - - - -
    getIsGameOver() {
        const isSomeAlive = this.pieces.some(({ isDead }) => !isDead);
        if (!isSomeAlive) return true;

        let winningTeamIndex = -1;
        this.pieces.every(piece => {

            // do not consider dead pieces.
            if (piece.isDead)
                return true;

            /*
                init 'winningTeamIndex.'
                continue to next living piece...
            */
            if (winningTeamIndex == -1) {
                winningTeamIndex = piece.teamIndex;
                return true;

                /*
                    every living piece's teamIndex must equal the 'winningTeamIndex.'
                */
            } else {
                const isOnlyOneTeamAlive = piece.teamIndex == winningTeamIndex;
                return isOnlyOneTeamAlive;
            }
        });
    }

    updateScore(teamIndex) {
        const playerTeamIndex = this.pieces[0].teamIndex;
        if (teamIndex != playerTeamIndex) {
            this.score += 1;
        }
    }

    initGameBoard() { }

    movePieces(accTime) {
        this.pieces.forEach(p => p.movePiece({ accTime, PlayerInputHandler: this.playerInputHandler }));
        // this.deathPieces.forEach(d => d.draw());
    }

    runGame(accTime) {
        if (this.isPaused) return;

        if (this.isKaiju)
            // Kaiju spawner doesn't consider paused time...
            this.manageKaijuSpawn(accTime);

        this.movePieces(accTime);
    }

    togglePauseGame(accTime) {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.timeoutHandler.pauseTimeouts(accTime);
        } else {
            this.timeoutHandler.restartTimeouts(accTime);
        }
    }

    registerTimeout(accTime, callback, delay) {
        const timeoutRef = this.timeoutHandler.registerTimeout(accTime, callback, delay);
        return timeoutRef;
    }

    unregisterTimeout(timeoutRef) {
        this.timeoutHandler.unregisterTimeout(timeoutRef);
    }

    spawnDeathPieceAtLocation(charLocation, avatar, tileIndex, color) {
        const zIndex = this.getFlattenedArrayIndex(tileIndex);
        const deathPiece = new DeathPiece(charLocation, avatar, zIndex, color); // TO-DO: make a DeathPiece class.
        this.deathPieces.push(deathPiece);
    }

    shootPower = ({
        pieceIndex,
        range,
        area,
        appliedStatus
    }) => {
        // TO-DO...
        // overwrite the piece's tile with the appliedStatus status...
    };
    // - - - - - - - - 



    // TEAM MANAGER - -
    getIsTeamDamaged(pieceIndex) {
        const teamIndex = this.pieces[pieceIndex].teamIndex;
        const teammates = this.teams[teamIndex].teammateIndices;
        return teammates.some(pieceIndex => {
            const teammate = this.pieces[pieceIndex];
            return teammate.lives < teammate.maxLives;
        });
    }
    getOtherTeamsPieces(pieceIndex) {
        const teamIndex = this.pieces[pieceIndex].teamIndex;
        const otherTeamsPieces = this.pieces.filter(p => p.teamIndex != teamIndex);
        return otherTeamsPieces;
    }

    addTeam(team) {
        team.teamIndex = this.teams.length;
        this.teams.push(team);
    }

    removeTeam(team) {
        if (this.teams.some(({ teamIndex }) => team.teamIndex == teamIndex)) {
            this.teams.splice(team.teamIndex, 1);
        }
    }
    // - - - - - - - - - -



    // SETTINGS - - - - - -
    updateDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    updatePlayerAvatar(playerAvatar) {
        this.playerAvatar = playerAvatar;
    }

    updateGameMode(gameMode) {
        this.gameMode = gameMode;
    }

    updateAbility() { } // ability editor 
    // - - - - - - - - - - -



    // KAIJU MANAGER - - - -
    determineKaijuDetailsFromDifficulty() {
        let MAX_AT_ONCE, MAX_TO_WIN, KAIJU_MAX_HEALTH, KAIJU_MAX_SPEED, KAIJU_COOL_DOWN = undefined;
        switch (this.difficulty) {
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

    spawnNewKaiju() {
        this.kaijuCount += 1;
    }

    respawnKaiju() { }

    manageKaijuSpawn(accTime) {

        const isRespawn = this.kaijuCount >= this.maxKaijuAtOnce;
        const spawnInterval = isRespawn ? this.kaijuRespawnInterval : this.kaijuSpawnInterval;

        if (getIsSpawnNewKaiju(accTime, spawnInterval)) {
            if (isRespawn && this.getIsAnyDeadKaiju()) {
                this.respawnKaiju();
            } else {
                this.spawnNewKaiju();
            }
        }
    }

    getIsAnyDeadKaiju() {
        const kaijuIndices = this.teams[this.kaijuTeamIndex].getTeamPiecesIndices();
        return kaijuIndices.some(i => this.pieces[i].isDead);
    }
    // - - - - - - - - -


    // TILE STATE MANAGER - - -
    updateTileState() { }
    solveForStatusWithNoCounts() { }
    solveForNextTile() { }
    solveForWallReflectionStatus() { }
    solveForCurrentTile() { }
    solveForStatus() { }
    redrawTiles() { }
    resetHightlightedTiles() {
        this.highlightedTiles = [];
    }
    // - - - - - - - - - -


    // WEBSITE NAVIGATION - - - - - -
    goToTutorialPage(tutorialIndex) { this.tutorialIndex = tutorialIndex; }
    goToMainMenu() { }
    goToSettings() { }
    // - - - - - - - - - - - -


    // ZOOM HELPER - - - - - -
    zoomInToTile(zoomTile, desiredZoomOutInNumTilesFromZoomTile) { }
    updateScale(scale) {
        this.scale = scale;
    }
    resetZoom() {
        this.zoomLvl = ZoomLvl.NoZoom;
    }
    // - - - - - - - - - - - - -


    // MATH HELPER - - - - - -
    getRandomIntInRange({ min = 0, max }) {
        const _min = Math.ceil(min);
        const _max = Math.floor(max + 1);
        const randomInt = Math.floor(Math.random() * (_max - _min) + _min);
        return randomInt;
    };
    getFlattenedArrayIndex(tileIndex) {
        const { i, j } = tileIndex;
        return i !== undefined && j !== undefined ? this.numTileRows * j + i : 0;
    };
    getDistanceToFrom(to, from) {
        return Math.sqrt(
            (to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y)
        );
    };
    getNormVecFromDestAndOrigin(destXY, originXY) {
        const distance = getDistanceToFrom(destXY, originXY);
        const normVec = !!distance ? {
            x: (destXY.x - originXY.x) / distance,
            y: (destXY.y - originXY.y) / distance
        } : { x: 0, y: 0 };
        return normVec;
    }
    // - - - - - - - - - - - - 


    // GAMEBOARD HELPER - - - - - -
    changeBounds({ newBounds = '', lookup = PENINSULA_TILE_LOOKUP, rows = MAX_ROWS, columns = MAX_COLS }) {
        this.bounds = !!Bounds[newBounds] ? Bounds[newBounds] : Bounds.Lookup;
        this.boundsLookup = lookup;
        this.numTileRows = rows;
        this.numTileColumns = columns;
    }

    getIsInBounds(tileIndex) {
        if (this.bounds == Bounds.Grid) {
            // ASSUMES: (1) non-inclusive and (2) i = rows, j = columns... CONFIRM/TEST
            return tileIndex.i < this.numTileRows && tileIndex.j < this.numTileColumns;
        } else {
            return !!this.boundsLookup[`${tileIndex.i} ${tileIndex.j}`];
        }
    }

    findPathFromTo = (startIndex, goalIndex, /* and (optionally) avoid: */ enemyTiles = undefined) => {
        let count = 0;
        return recur(startIndex, [], count).reduce((acc, tileIndex) => {
            if (!!tileIndex && !acc.lookup[`${tileIndex.i} ${tileIndex.j}`]) {
                acc.lookup[`${tileIndex.i} ${tileIndex.j}`] = true;
                acc.result.push(tileIndex);
            }
            return acc;
        }, { lookup: {}, result: [] }
        ).result;
        function recur(currTileIndex, arr, count) {
            if ((currTileIndex.i === goalIndex.i && currTileIndex.j === goalIndex.j) || count > 400)
                return arr;

            // produce all possible adjacent tile indices to currTile
            let adjacentTiles = this.getAdjacentTileIndices(currTileIndex);

            if (!!enemyTiles) {
                const tilesWithEnemyTilesRemoved = adjacentTiles.filter(t => {
                    // filter-out adjacent tiles that have Kaiju on them
                    if (enemyTiles.some(e => e.i === t.i && e.j === t.j)) return false;

                    // // filter-out adjacent tiles that have adjacent tiles with Kaiju on them
                    const adjAdjTiles = this.getAdjacentTileIndices(t).flat();
                    return adjAdjTiles.every(at => !enemyTiles.some(e => e.i === at.i && e.j === at.j));
                });

                // do not allow teammate to run through enemies (if possible...)
                if (!!tilesWithEnemyTilesRemoved.length) {
                    adjacentTiles = tilesWithEnemyTilesRemoved;
                }
            }

            // get all charXAndY for each confirmed adjacent tile
            const goalXY = this.getCharXAndYFromTileIndex(goalIndex);
            const test = this.getCharXAndYFromTileIndex(adjacentTiles[0]);
            const shortest = {
                tileIndex: adjacentTiles[0],
                distance: this.getDistanceToFrom(test, goalXY)
            };
            adjacentTiles.forEach(t => {
                const adjXY = this.getCharXAndYFromTileIndex(t);
                const distance = this.getDistanceToFrom(adjXY, goalXY);
                if (distance < shortest.distance) {
                    shortest.tileIndex = t;
                    shortest.distance = distance;
                }
            });
            if (
                shortest.tileIndex &&
                shortest.tileIndex.i == currTile.i &&
                shortest.tileIndex.j == currTile.j
            ) {
                const keyedArr = arr.map(({ i, j }) => `${i} ${j}`);
                const remainingTiles = adjacentTiles.filter(
                    ({ i, j }) => !keyedArr.includes(`${i} ${j}`)
                );
                const randInt = this.getRandomIntInRange({ max: remainingTiles.length - 1 });
                const randTile = remainingTiles[randInt];
                const _arr = [...arr, randTile];
                return recur(randTile, _arr, count + 1);
            } else if (shortest.tileIndex) {
                const _arr = [...arr, shortest.tileIndex];
                return recur(shortest.tileIndex, _arr, count + 1);
            } else {
                return [];
            }
        }
    };

    getTileXAndYFromTileIndex({ i, j }) {
        const x = (i === 0 ? i * 45 - 25 : i * 45 + 25 * (i - 1)) * this.scale;
        const y = (i % 2 ? j * 80 + 40 : j * 80) * this.scale;
        return { x, y };
    };

    getCharXAndYFromTileIndex({ i, j }) {
        const x =
            (i === 0 ? i * 45 - 25 : i * 45 + 25 * (i - 1)) * this.scale + 52.5 * this.scale;
        const y = (i % 2 ? j * 80 + 40 : j * 80) * this.scale + 42.5 * this.scale;
        return { x, y };
    };

    getAreTilesAdjacent(tileIndex1, tileIndex2) {
        return [
            { i: 0, j: -1 },
            { i: 1, j: tileIndex1.i % 2 ? 0 : -1 },
            { i: 1, j: tileIndex1.i % 2 ? 1 : 0 },
            { i: 0, j: 1 },
            { i: -1, j: tileIndex1.i % 2 ? 1 : 0 },
            { i: -1, j: tileIndex1.i % 2 ? 0 : -1 }
        ]
            .map(t => {
                return { i: t.i + tileIndex1.i, j: t.j + tileIndex1.j };
            })
            .some(t => tileIndex2.i === t.i && tileIndex2.j === t.j);
    };

    getAdjacentTileIndices = tileIndex => {
        return [
            { i: 0, j: -1 },
            { i: 1, j: tileIndex.i % 2 ? 0 : -1 },
            { i: 1, j: tileIndex.i % 2 ? 1 : 0 },
            { i: 0, j: 1 },
            { i: -1, j: tileIndex.i % 2 ? 1 : 0 },
            { i: -1, j: tileIndex.i % 2 ? 0 : -1 }
        ]
            .map(t => {
                return { i: t.i + tileIndex.i, j: t.j + tileIndex.j };
            }).filter(tileIndex => this.getIsInBounds(tileIndex))
    };

    getAdjacentAdjacentTileIndices = tileIndex => {
        return [
            // ADJACENT TILES
            { i: 0, j: -1 },
            { i: 1, j: tileIndex.i % 2 ? 0 : -1 },
            { i: 1, j: tileIndex.i % 2 ? 1 : 0 },
            { i: 0, j: 1 },
            { i: -1, j: tileIndex.i % 2 ? 1 : 0 },
            { i: -1, j: tileIndex.i % 2 ? 0 : -1 },

            // TILES THAT ARE TWO ADJACENT
            { i: 0, j: 2 }, // up two
            { i: 0, j: -2 }, // down two
            { i: -2, j: -1 }, // up left two
            { i: 2, j: -1 }, // up right two
            { i: -2, j: 1 }, // down left two
            { i: 2, j: 1 }, // down right two
            { i: -1, j: tileIndex.i % 2 ? -1 : -2 }, // top left two
            { i: 1, j: tileIndex.i % 2 ? -1 : -2 }, // top right two
            { i: -2, j: 0 }, // left two
            { i: 2, j: 0 }, // right two
            { i: -1, j: tileIndex.i % 2 ? 2 : 1 }, // bottom left two
            { i: 1, j: tileIndex.i % 2 ? 2 : 1 }, // bottom right two
        ]
            .map(t => {
                return { i: t.i + tileIndex.i, j: t.j + tileIndex.j };
            }).filter(tileIndex => this.getIsInBounds(tileIndex))
    };

    getClosestPieceFromTileIndex = (entityData, tileIndex) => {
        /* returns pieceIndex and piece's tileIndex */
        const pieceIndex = entityData
            .map(entity =>
                entity.lives > 0 && entity.isOnTiles
                    ? [this.getDistanceToFrom(this.getCharXAndYFromTileIndex(tileIndex), entity.charLocation), entity.pieceIndex]
                    : null
            )
            .reduce(
                (maxDistanceData, [distance, pieceIndex]) => {
                    return distance && maxDistanceData.distance > distance
                        ? { i: pieceIndex, distance }
                        : maxDistanceData;
                },
                { i: -1, distance: Number.MAX_SAFE_INTEGER }
            ).i;
        return pieceIndex != -1 ? [entityData[pieceIndex].tileIndex, pieceIndex] : [{ i: 0, j: 0 }, -1];
    };

    getClosestEnemy(pieceIndex) {
        const otherTeamsPieces = this.getOtherTeamsPieces(pieceIndex);
        const tileIndex = this.pieces[pieceIndex].tileIndex;
        const [_, enemyPieceIndex] = this.getClosestPieceFromTileIndex(otherTeamsPieces, tileIndex);
        return enemyPieceIndex == -1 ? undefined : this.pieces[enemyPieceIndex];
    }

    getPathToClosestEnemy(pieceIndex) {
        const tileIndex = this.pieces[pieceIndex].tileIndex;
        const enemy = this.getClosestEnemy(pieceIndex);
        const path = !!enemy ? this.findPathFromTo(tileIndex, enemy.tileIndex) : [];
        return path;  // aka: 'moveToTiles'
    }

    getPathToTeamLeader(pieceIndex) {
        const teamIndex = this.pieces[pieceIndex].teamIndex;
        const leaderPieceIndex = this.teams[teamIndex].teamLeaderIndex;
        const leaderPiece = this.pieces[leaderPieceIndex];
        const piece = this.pieces[pieceIndex];
        const path = this.findPathFromTo(piece.tileIndex, leaderPiece.tileIndex);
        return path;  // aka: 'moveToTiles'
    }

    moveTo({
        currentLocation,
        moveFromLocation,
        moveToLocation,
        moveSpeed
    }) {
        const distanceFromStart = this.getDistanceToFrom(moveFromLocation, currentLocation);
        const distanceToFinish = this.getDistanceToFrom(moveToLocation, currentLocation);
        const totalDistance = this.getDistanceToFrom(moveFromLocation, moveToLocation);
        const { x, y } = currentLocation;
        const x_dir = distanceToFinish
            ? (moveToLocation.x - x) / distanceToFinish
            : 0;
        const y_dir = distanceToFinish
            ? (moveToLocation.y - y) / distanceToFinish
            : 0;
        const hasArrived =
            distanceToFinish < moveSpeed || distanceFromStart > totalDistance;
        return {
            newLocation: {
                x: x + x_dir * moveSpeed,
                y: y + y_dir * moveSpeed
            },
            hasArrived
        };
    };

    getSafeTileIndex(pieceIndex) {
        const otherTeamsPieces = this.getOtherTeamsPieces(pieceIndex);

        const otherTeamsTilesLookup = otherTeamsPieces.reduce((acc, { tileIndex }) => {
            acc[`${tileIndex.i} ${tileIndex.j}`] = tileIndex;
            return acc;
        }, {});

        let safeTileObj = {
            distance: Number.MIN_SAFE_INTEGER,
            tileIndex: this.getRandomTileOnBoard()
        };

        if (!otherTeamsPieces.length) {
            return safeTileObj
        }

        const sumLocations = otherTeamsPieces
            .filter(({ lives }) => !!lives)
            .map((charLocation) => charLocation)
            .reduce((acc, item) => {
                acc.x += item.x;
                acc.y += item.y;
                return acc
            }, { x: 0, y: 0 });

        const avgLocation = { x: sumLocations.x / otherTeamsPieces.length, y: sumLocations.y / otherTeamsPieces.length };

        const teamIndex = this.pieces[pieceIndex].teamIndex;
        const allTiles = this.getLookupVals();
        allTiles.forEach(tileIndex => {
            const currTileXY = this.getCharXAndYFromTileIndex(tileIndex);
            const testDist = this.getDistanceToFrom(currTileXY, avgLocation);
            if (testDist > safeTileObj.distance) {
                const isSafe =
                    // TO-DO: ensure below lines are correct...
                    !this.tiles[tileIndex.i][tileIndex.j].getIsDmgTile(teamIndex) // dmg tile status
                    &&
                    !otherTeamsTilesLookup[`${t.i} ${t.j}`] // enemy tile, will cause dmg  

                if (isSafe) {
                    safeTileObj = {
                        distance: testDist,
                        tileIndex
                    };
                }
            }
        });
        return safeTileObj.tileIndex;
    };

    getLookupVals() {
        if (this.bounds == Bounds.Grid) {
            // TO-DO: make this work... check with Google...
            const gridVals = Array(this.numTileRows, this.numTileColumns).fill(0).map((_, i, j) => { i, j });
            return gridVals;
        } else if (this.boundsLookup == PENINSULA_TILE_LOOKUP) {
            return PENINSULA_TILE_LOOKUP_VALS;
        } else {
            const tileIndices = Object.values(this.boundsLookup);
            return tileIndices
        }
    }

    getRandomTileOnBoard() {
        if (this.bounds == Bounds.Grid) {
            return {
                // TO-DO: ensure that i = row and j = column...
                i: this.getRandomIntInRange({ max: this.numTileRows }),
                j: this.getRandomIntInRange({ max: this.numTileColumns })
            };
        } else {
            const tileIndices = this.getLookupVals(); // eg. [{ i: 0, j: 0 }, ...]
            const randomInt = this.getRandomIntInRange({ max: tileIndices.length - 1 });
            return tileIndices[randomInt];
        }
    };

    getPathToSafeTile(pieceIndex) {
        const safeTileIndex = this.getSafeTileIndex(pieceIndex);
        const tileIndex = this.pieces[pieceIndex].tileIndex;
        const path = this.findPathFromTo(tileIndex, safeTileIndex);
        return path;  // aka: 'moveToTiles'
    }

    getPathToSafeTileAndAvoidEnemies(pieceIndex) {
        const safeTileIndex = this.getSafeTileIndex(pieceIndex);
        const tileIndex = this.pieces[pieceIndex].tileIndex;
        const otherTeamsPieces = this.getOtherTeamsPieces(pieceIndex);
        const path = this.findPathFromTo(tileIndex, safeTileIndex, /* ...and avoid: */ otherTeamsPieces.map(({ tileIndex }) => tileIndex));
        return path;  // aka: 'moveToTiles'
    }

    getIsPieceInDanger(pieceIndex) {
        const otherTeamsTilesLookup = this.getOtherTeamsPieces(pieceIndex).reduce((acc, { tileIndex }) => {
            acc[`${tileIndex.i} ${tileIndex.j}`] = tileIndex;
            return acc;
        }, {});

        const tileIndex = this.pieces[pieceIndex].tileIndex;
        const teamIndex = this.pieces[pieceIndex].teamIndex;

        const surroundingTileIndices = this.getAdjacentAdjacentTileIndices(tileIndex);

        const isInDanger =
            !!surroundingTileIndices &&
            surroundingTileIndices.some(
                t =>
                    !!t &&
                    (Array.isArray(this.tiles[t.i]) &&
                        Array.isArray(this.tiles[t.i][t.j]) &&
                        !!this.tiles[t.i][t.j] &&
                        this.tiles[t.i][t.j].getIsDmgTile(teamIndex)
                        && this.tiles[t.i][t.j].getDmg() > 0
                    ) // enemy status tile, will cause dmg
                    ||
                    !!otherTeamsTilesLookup[`${t.i} ${t.j}`] // enemy tile, will cause dmg  
            );
        return isInDanger;
    }

    getDmg(pieceIndex) {
        let { tileIndex, teamIndex } = this.pieces[pieceIndex];
        const tile = this.tiles[tileIndex.i][tileIndex.j];
        const isDmg = tile.getIsDmgTile(teamIndex);
        return isDmg ? tile.getDmgAmt() : 0;
    }

    getTileOffsetFromDir(dir, tileIndex) {
        switch (dir) {
            case "up":
                return { i: 0, j: -1 }; // up
            case "up right":
                return { i: 1, j: tileIndex.i % 2 ? 0 : -1 }; // up right
            case "down right":
                return { i: 1, j: tileIndex.i % 2 ? 1 : 0 }; // down right
            case "down":
                return { i: 0, j: 1 }; // down
            case "down left":
                return { i: -1, j: tileIndex.i % 2 ? 1 : 0 }; // down left
            case "up left":
                return { i: -1, j: tileIndex.i % 2 ? 0 : -1 }; // up left
            default:
                return { i: 0, j: 0 };
        }
    }

    getDirFromTiles(currTileIndex, nextTileIndex) {
        const areAdjacent = getAreTilesAdjacent(currTileIndex, nextTileIndex);

        if (areAdjacent) {
            const offset = { i: nextTileIndex.i - currTileIndex.i, j: nextTileIndex.j - currTileIndex.j };
            const lookup_key = `${offset.i} ${offset.j} ${currTileIndex.i % 2}`;
            const lookup = {
                "0 -1 0": "up",
                "0 -1 1": "up",
                "0 1 1": "down",
                "0 1 0": "down",
                "0 0 0": "idle",
                "0 0 1": "idle",
                "1 0 1": "upRight",
                "1 -1 0": "upRight",
                "1 1 1": "downRight",
                "1 0 0": "downRight",
                "-1 1 1": "downLeft",
                "-1 0 0": "downLeft",
                "-1 0 1": "upLeft",
                "-1 -1 0": "upLeft"
            };
            const dir = lookup[lookup_key];
            return dir;

        } else {

            const originXY = this.getTileXAndYFromTileIndex(currTileIndex)
            const destXY = this.getTileXAndYFromTileIndex(nextTileIndex)
            const normVec = getNormVecFromDestAndOrigin(destXY, originXY)
            const dir = getDirFromNormVec(normVec);
            return dir;
        }

    };

    getDirFromNormVec(normVec) {
        const xDir = normVec.x > 0 ? "Right" : "Left"; // go right
        const yDir = normVec.y > 0 ? "down" : "up"; // go up
        return `${yDir}${xDir}`;
    }
    // - - - - - - - - - - - - - - -
}