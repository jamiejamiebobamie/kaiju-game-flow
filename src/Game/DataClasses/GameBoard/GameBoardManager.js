import { Bounds, PERIMETER_TILES_VALS, PENINSULA_TILE_LOOKUP, PENINSULA_TILE_LOOKUP_VALS, MAX_ROWS, MAX_COLS } from 'Utils/gameState';
import { getRandomIntInRange, getDistanceToFrom, getNormVecFromDestAndOrigin, getDotProduct } from 'Game/utils'
import { GameBoardTile } from 'Game/DataClasses/GameBoard/Tile/GameBoardTile'

export class GameBoardManager {
    constructor({ scale, gameManagerProxy }) {
        this.gameManagerProxy = gameManagerProxy;
        this.updateProxyProps = undefined;
        this.clickedTileIndex = undefined;
        this.hoveredTileIndex = undefined;
        this.tiles = []; // per tile (unique 'i' and 'j') rendering and tile status info
        this.numTileColumns = MAX_COLS;
        this.numTileRows = MAX_ROWS;
        this.isRenderTiles = true;
        this.isRenderMap = true;
        this.bounds = Bounds.Lookup;
        this.boundsLookup = PENINSULA_TILE_LOOKUP;
        this.scale = scale;
        this.tilesLookupVals = []
    }

    initTiles() {
        const tiles = [];
        for (let i = 0; i < this.numTileColumns; i++) {
            const row = []
            for (let j = 0; j < this.numTileRows; j++) {
                const tileIndex = { i, j };
                const newTile = new GameBoardTile({
                    tileIndex,
                    isVisible: this.getIsInBounds(tileIndex),
                    tileLocation: this.getTileXAndYFromTileIndex(tileIndex),
                    zIndex: this.getFlattenedArrayIndex(tileIndex),
                    scale: this.scale,
                    gameManagerProxy: this.gameManagerProxy
                })
                row.push(newTile);
            }
            tiles.push(row);
        }
        this.tiles = tiles;
    }

    getClickedTileIndex = () => {
        return this.clickedTileIndex;
    }

    getHoveredTileIndex = () => {
        return this.hoveredTileIndex;
    }

    setClickedTileIndex = (clickedTileIndex) => {
        this.clickedTileIndex = clickedTileIndex;
    }

    clearClickedTileIndex = () => {
        this.clickedTileIndex = undefined;
    }

    setHoveredTileIndex = (hoveredTileIndex) => {
        this.hoveredTileIndex = hoveredTileIndex;
    }

    getNumTileColumns() {
        return this.numTileColumns;
    }

    getTilesInFlatArray() {
        return this.tiles.flat();
    }

    async getTilesIterator() {
        for (let i = 0; i < this.numTileColumns; i++) {
            for (let j = 0; j < this.numTileRows; j++) {
                await this.tiles[i][j];
            }
        }
    }

    resetTiles() {
        this.tiles = [];
    }

    setUpdateProxyProps(updateMethod) {
        this.updateProxyProps = updateMethod;
    }

    updateTileWithAbilityStatus = ({
        accTime,
        pieceIndex,
        appliedStatus
    }) => {
        const pieceTileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);

        // determine target of power
        /*
            set target as self as fail-safe so game doesn't crash
            status will 'shoot' at self but will not impact.
        */
        const self = this.gameManagerProxy.getPiece(pieceIndex);
        let target = self;
        if (appliedStatus == 'isHealing') {
            const teammate = this.gameManagerProxy.getMostDmgedTeammate(pieceIndex);
            if (!!teammate) {
                target = teammate;
            }
        } else {
            const enemy = this.getClosestEnemy(pieceIndex);
            if (!!enemy) {
                target = enemy;
            }
        }

        const abilityAndTileStatusData = this.gameManagerProxy.getAbilityAndTileStatusData();
        const tileStatus = abilityAndTileStatusData[appliedStatus];

        const targetTileIndex = target.getTileIndex();
        /*
            1. get the 'tileIndex' of the tile to update with the 'appliedStatus'
            2. also: get the directions ('dirs') the status will spread in
                from that tile on next update
        */
        const { area } = tileStatus;
        const [tileIndex, dirs] = this.getNumAdjacentTilesInDirectionFromTileToTile({ fromTileIndex: pieceTileIndex, toTileIndex: targetTileIndex, numTiles: area })

        const targetIndex = target.getPieceIndex();

        const teamIndex = this.gameManagerProxy.getPieceTeamIndex(pieceIndex);
        const { range } = tileStatus;

        // TEST
        if (pieceIndex == 0) {
            console.log({
                accTime,
                pieceIndex,
                appliedStatus,
                pieceTileIndex,
                self,
                target,
                abilityAndTileStatusData,
                tileStatus,
                targetTileIndex,
                area,
                tileIndex,
                dirs,
                targetIndex,
                teamIndex,
                range,
                isInBounds: this.getIsInBounds(tileIndex)
            })
        }

        if (this.getIsInBounds(tileIndex)) {
            // TO-DO: consider setting tile's 'contenders' with desired status
            this.tiles[tileIndex.i][tileIndex.j].updateTileStatus({ updateKey: accTime, tileStatus, currCount: range, dirs, teamIndex, targetIndex });
        }
    };

    updateTileState(accTime) {

        // iterate TWICE through gameboard tiles
        let iterCount = 1;
        // FIRST ITERATION: iterate from TOP-LEFT corner to BOTTOM-RIGHT corner
        for (let i = 0; i < this.numTileColumns; i++) {
            for (let j = 0; j < this.numTileRows; j++) {
                this.iterateThroughGameboardTilesAndCreateContenders({ i, j, accTime, iterCount });
            }
        }

        iterCount++;
        /*
            SECOND ITERATION: iterate from BOTTOM-RIGHT corner to TOP-LEFT corner
            Fixes bug when status is travelling in the opposite direction as the update...
 
            TO-DO: test if this is still necessary...
        */
        // for (let i = this.numTileColumns - 1; i > -1; i--) {
        //     for (let j = this.numTileRows - 1; j > -1; j--) {
        //         this.iterateThroughGameboardTilesAndCreateContenders({ i, j, accTime, iterCount });
        //     }
        // }

        const { lookup } = this.getHighlightedTiles();

        // const checkedKeys = {};
        // A tile status is valid (and not an update bug) if it is present in a tile's 'contenders' lookup twice
        for (let i = 0; i < this.numTileColumns; i++) {
            for (let j = 0; j < this.numTileRows; j++) {
                const tile = this.tiles[i][j];
                const contenders = tile.getContenders();
                let count = 0;
                // !!Object.keys(contenders).length && console.log({ tile, contenders });
                const reducedContenders = Object.values(contenders).reduce((acc, v) => {
                    // const kParts = k.split(" ");
                    // kParts.pop(); // remove 'iterCount' from key
                    // const key = kParts.join(" ");
                    // const isValid = true;//contenders[`${key} ${1}`] && contenders[`${key} ${2}`];
                    // const isChecked = checkedKeys[key];
                    // checkedKeys[key] = true; // only add the contender once
                    // if (isValid && !isChecked) {
                    const appliedStatus = v.getAppliedStatus();

                    if (!!acc[appliedStatus]) {
                        if (v.getCurrCount() > acc[appliedStatus].getCurrCount()) {
                            acc[appliedStatus] = v;
                            count++;
                        }
                    } else {
                        acc[appliedStatus] = v;
                        count++;
                    }
                    // }
                    return acc;
                }, {});

                if (count > 0) {
                    // NOTE: 'reducedContenders' lookup uses 'appliedStatus' keys
                    console.log("before", { reducedContenders, tile });
                    tile.setContenders(reducedContenders);
                    tile.resolveContendersAndSetNewTileStatus();
                    console.log("after", { reducedContenders, tile });
                } else {
                    tile.clearTileStatus();
                }

                tile.clearContenders();

                // update player tile highlight from hovered or clicked tile
                const isHighlighted = lookup.has(`${i} ${j}`);
                this.tiles[i][j].setIsHighlighted(isHighlighted);
            }
        }
    }

    iterateThroughGameboardTilesAndCreateContenders({ i, j, accTime, iterCount }) {
        const tile = this.tiles[i][j];
        const tileIndex = tile.tileIndex;

        tile.setUpdateKey(accTime);

        if (tile.isVisible) { // is on board

            const tileStatus = tile.getTileStatus();

            if (!!tileStatus) {

                const currCount = tile.getCurrCount();

                // 1. persist curr tile's status on curr tile
                if (tileStatus.getIsPersistent() || (tileStatus.getIsLeaveTrail() && currCount != 0)) {
                    const contenderCount = 0;

                    const tileContender = tile.getTileContenderFromTile({ contenderCount });
                    const key = tileContender.getKey(iterCount);
                    // add current tile status to contenders
                    tile.addContender(key, tileContender);
                }

                // 2. move curr tile's status to adjacent tiles based on dirs
                if (currCount != 0) {
                    const dirs = tile.getDirs();
                    dirs.forEach(d => {
                        const tileIndexOffset = this.getTileOffsetFromDir(d, tileIndex);
                        const nextTileIndex = { i: tileIndex.i + tileIndexOffset.i, j: tileIndex.j + tileIndexOffset.j };

                        let newDirs = [d];
                        if (this.getIsInBounds(nextTileIndex)) {
                            if (tileStatus.getIsRotating(currCount)) {
                                newDirs = tileStatus.rotateStatus(currCount);
                            } else if (tileStatus.getIsConserveDirections(currCount)) {
                                newDirs = dirs;
                            } else if (tileStatus.getIsTracking(currCount)) {
                                const pieceIndex = tile.targetIndex;
                                const targetTileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);
                                const [_, dirs] = this.getNumAdjacentTilesInDirectionFromTileToTile({ fromTileIndex: tileIndex, toTileIndex: targetTileIndex });
                                newDirs = dirs;
                            } else if (tileStatus.getIsSpread(currCount)) {
                                const area = tileStatus.getSpreadArea(currCount);
                                const [_, dirs] = this.getNumAdjacentTilesInDirectionFromTileToTile({ fromTileIndex: tileIndex, toTileIndex: nextTileIndex, numTiles: area });
                                newDirs = dirs;
                            } else if (tileStatus.getIsReverseDirection(currCount)) {
                                newDirs = tileStatus.reverseDir(d);
                            }


                            // SIDE EFFECT: 'getTileContenderFromTile' decrements currCount for next tile update
                            // NOTE: count was being decremented by -1 or -2... (ie. removed randomness)
                            const tileContender = tile.getTileContenderFromTile({ newDirs });
                            const key = tileContender.getKey(iterCount);

                            const nextTile = this.tiles[nextTileIndex.i][nextTileIndex.j];
                            // add current tile status to next tile's contenders
                            nextTile.addContender(key, tileContender);

                            // TEST
                            tileStatus.getAppliedStatus() == 'isOnFire'
                                && console.log("inBounds", {
                                    tileContender,
                                    key,
                                    nextTile,
                                    nextTileIndex,
                                    newDirs, tileStatus, tile, currCount, d
                                });

                        } else if (tileStatus.getIsBouncy()) {
                            /*
                                next tile is not on game board,
                                if status isBouncy, reflect status back onto the game board.
                                find the reflected dir based on tileStatus' 'bounceLogic'
                            */

                            const rd = tileStatus.reflectDir(d);
                            const tileIndexOffset = this.getTileOffsetFromDir(rd, tileIndex);
                            const reflectedTileIndex = { i: tileIndex.i + tileIndexOffset.i, j: tileIndex.j + tileIndexOffset.j };
                            if (this.getIsInBounds(reflectedTileIndex)) {
                                const tileContender = tile.getTileContenderFromTile({ currCount: tileStatus.getBounceCount(currCount), newDirs: rd });
                                const key = tileContender.getKey(iterCount);

                                const reflectedTile = this.tiles[reflectedTileIndex.i][reflectedTileIndex.j];
                                // add current tile status to next tile's contenders
                                reflectedTile.addContender(key, tileContender);

                                // TEST
                                tileStatus.getAppliedStatus() == 'isOnFire'
                                    && console.log("reflected", {
                                        tileContender,
                                        key,
                                        reflectedTile,
                                        reflectedTileIndex,
                                        rd, tileStatus, tile, currCount, d
                                    });
                            }
                        }
                    })
                }
            }
        }
    }

    getFlattenedArrayIndex(tileIndex) {
        const { i, j } = tileIndex;
        return i !== undefined && j !== undefined ? this.numTileRows * j + i : 0;
    };

    getHighlightedTiles = () => {
        let highlightedTileIndices = [];
        const lookup = new Set();

        const player = this.gameManagerProxy.getPlayerPiece();
        const moveToTiles = player.getMoveToTiles();

        const toTileIndex = this.hoveredTileIndex || this.clickedTileIndex;
        if (toTileIndex) {
            // show clicked or hovered path
            const playerTileIndex = player.getTileIndex();
            highlightedTileIndices = this.findPathFromTo(playerTileIndex, toTileIndex);
            highlightedTileIndices.forEach(({ i, j }) => lookup.add(`${i} ${j}`));
        } else if (!!moveToTiles.length) {
            // show next tile from move with <WASD/arrow> keys
            const nextTile = moveToTiles[0];
            highlightedTileIndices = [nextTile];
            lookup.add(`${nextTile.i} ${nextTile.j}`)
        }

        return { lookup, highlightedTileIndices };
    }

    /* "PRIVATE" METHOD... call 'updateBounds' */
    changeBounds({ newBounds = '', lookup = PENINSULA_TILE_LOOKUP, rows = MAX_ROWS, columns = MAX_COLS }) {
        this.bounds = !!Bounds[newBounds] ? Bounds[newBounds] : Bounds.Lookup;
        this.boundsLookup = lookup;
        this.numTileRows = rows;
        this.numTileColumns = columns;
    }

    updateBounds({ newBounds = '', lookup = PENINSULA_TILE_LOOKUP, rows = MAX_ROWS, columns = MAX_COLS }) {
        this.changeBounds({ newBounds, lookup, rows, columns });
        this.tilesLookupVals = this.getLookupVals();
        this.updateProxyProps();
    }

    getIsInBounds = (tileIndex) => {
        if (this.bounds == Bounds.Grid) {
            // ASSUMES: (1) non-inclusive and (2) i = rows, j = columns... CONFIRM/TEST
            return tileIndex.i < this.numTileColumns && tileIndex.j < this.numTileRows;
        } else {
            return !!this.boundsLookup[`${tileIndex.i} ${tileIndex.j}`];
        }
    }

    findPathFromTo = (startIndex, goalIndex, /* and (optionally) avoid: */ enemyTiles = undefined, isAlwaysAvoid = false) => {
        const recur = (currTileIndex, arr, count) => {
            if ((currTileIndex.i === goalIndex.i && currTileIndex.j === goalIndex.j) || count > 400)
                return arr;

            // produce all possible adjacent tile indices to currTile
            let adjacentTiles = this.getAdjacentTileIndices(currTileIndex);

            if (!!enemyTiles) {
                const tilesWithEnemyTilesRemoved = adjacentTiles.filter(t => {
                    // filter-out adjacent tiles that have other team's pieces on them
                    if (enemyTiles.some(e => e.i === t.i && e.j === t.j)) return false;

                    // filter-out adjacent tiles that have adjacent tiles with other team's pieces on them
                    const adjAdjTiles = this.getAdjacentAdjacentTileIndices(t).flat();//getAdjacentTileIndices(t).flat();
                    return adjAdjTiles.every(at => !enemyTiles.some(e => e.i === at.i && e.j === at.j));
                });

                // do not allow teammate to run through enemies (if possible...)
                if (isAlwaysAvoid || !!tilesWithEnemyTilesRemoved.length) {
                    adjacentTiles = tilesWithEnemyTilesRemoved;
                }
            }

            // get all charXAndY for each confirmed adjacent tile
            const goalXY = this.getCharXAndYFromTileIndex(goalIndex);
            const test = this.getCharXAndYFromTileIndex(adjacentTiles[0]);
            const shortest = {
                tileIndex: adjacentTiles[0],
                distance: getDistanceToFrom(test, goalXY)
            };
            adjacentTiles.forEach(t => {
                const adjXY = this.getCharXAndYFromTileIndex(t);
                const distance = getDistanceToFrom(adjXY, goalXY);
                if (distance < shortest.distance) {
                    shortest.tileIndex = t;
                    shortest.distance = distance;
                }
            });
            if (
                shortest.tileIndex &&
                shortest.tileIndex.i == currTileIndex.i &&
                shortest.tileIndex.j == currTileIndex.j
            ) {
                const keyedArr = arr.map(({ i, j }) => `${i} ${j}`);
                const remainingTiles = adjacentTiles.filter(
                    ({ i, j }) => !keyedArr.includes(`${i} ${j}`)
                );
                const randInt = getRandomIntInRange({ max: remainingTiles.length - 1 });
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
        let count = 0;
        return recur(startIndex, [], count).reduce((acc, tileIndex) => {
            if (!!tileIndex && !acc.lookup[`${tileIndex.i} ${tileIndex.j}`]) {
                acc.lookup[`${tileIndex.i} ${tileIndex.j}`] = true;
                acc.result.push(tileIndex);
            }
            return acc;
        }, { lookup: {}, result: [] }
        ).result;
    };

    getTileXAndYFromTileIndex({ i, j }) {
        const x = (i === 0 ? i * 45 - 25 : i * 45 + 25 * (i - 1)) * this.scale;
        const y = (i % 2 ? j * 80 + 40 : j * 80) * this.scale;
        return { x, y };
    };

    getCharXAndYFromTileIndex = ({ i, j }) => {
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

    getAdjacentTileIndices(tileIndex) {
        return [
            { i: 0, j: -1 },
            { i: 1, j: tileIndex.i % 2 ? 0 : -1 },
            { i: 1, j: tileIndex.i % 2 ? 1 : 0 },
            { i: 0, j: 1 },
            { i: -1, j: tileIndex.i % 2 ? 1 : 0 },
            { i: -1, j: tileIndex.i % 2 ? 0 : -1 }
        ].map(t => ({ i: t.i + tileIndex.i, j: t.j + tileIndex.j }))
            .filter(tileIndex => this.getIsInBounds(tileIndex))
    };

    getNumAdjacentTilesInDirectionFromTileToTile({ fromTileIndex, toTileIndex, numTiles = 1 }) {
        const normVec = this.getNormVecFromTileIndices({ fromTileIndex, toTileIndex });
        return this.getAdjacentTilesFromNormVec(fromTileIndex, normVec, numTiles);
    }

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

    getClosestEnemy = (pieceIndex) => {
        const otherTeamsPieces = this.gameManagerProxy.getOtherTeamsPieces(pieceIndex);
        const tileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);
        const enemyPiece = this.getClosestPieceFromTileIndex(otherTeamsPieces, tileIndex);
        return enemyPiece;
    }

    getPathToClosestEnemy = (pieceIndex) => {
        const tileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);
        const enemy = this.getClosestEnemy(pieceIndex);
        const path = !!enemy ? this.findPathFromTo(tileIndex, enemy.tileIndex) : [];
        return path;  // aka: 'moveToTiles'
    }

    getPathFromTileToTile = ({ fromTile, toTile, avoidTiles, isAlwaysAvoid }) => {
        return this.findPathFromTo(fromTile, toTile, avoidTiles, isAlwaysAvoid);
    }

    getClosestPieceFromTileIndex = (pieces, tileIndex) => {
        const { piece } = pieces
            .filter(({ lives, isOnTiles }) => lives > 0 && !!isOnTiles)
            .reduce(
                (maxDistanceData, piece) => {
                    const distance = getDistanceToFrom(this.getCharXAndYFromTileIndex(tileIndex), piece.charLocation);
                    return maxDistanceData.distance > distance
                        ? { piece, distance }
                        : maxDistanceData;
                },
                { piece: undefined, distance: Number.MAX_SAFE_INTEGER }
            );

        return piece;
    };

    getPathToTeamLeader = (pieceIndex) => {
        const piece = this.gameManagerProxy.getPiece(pieceIndex);
        const leaderPiece = this.gameManagerProxy.getTeamLeaderPiece(pieceIndex);
        const teamPieces = this.gameManagerProxy.getTeamPieces(piece.teamIndex);
        const isAlwaysAvoid = true;
        const path = this.findPathFromTo(piece.getTileIndex(), leaderPiece.getTileIndex(), teamPieces, isAlwaysAvoid);
        return path;  // aka: 'moveToTiles'
    }

    moveTo = ({
        currentLocation,
        moveFromLocation,
        moveToLocation,
        moveSpeed
    }) => {
        const distanceFromStart = getDistanceToFrom(moveFromLocation, currentLocation);
        const distanceToFinish = getDistanceToFrom(moveToLocation, currentLocation);
        const totalDistance = getDistanceToFrom(moveFromLocation, moveToLocation);
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

    getSafeTileIndex = (pieceIndex) => {
        const otherTeamsPieces = this.gameManagerProxy.getOtherTeamsPieces(pieceIndex);

        const otherTeamsTilesLookup = otherTeamsPieces.reduce((acc, { tileIndex }) => {
            acc[`${tileIndex.i} ${tileIndex.j}`] = tileIndex;
            return acc;
        }, {});

        let safeTileObj = {
            distance: Number.MIN_SAFE_INTEGER,
            tileIndex: this.getRandomTileIndexOnBoard()
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

        const teamIndex = this.gameManagerProxy.getPieceTeamIndex(pieceIndex);
        const allTiles = this.tilesLookupVals;//this.getLookupVals();
        allTiles.forEach(tileIndex => {
            const currTileXY = this.getCharXAndYFromTileIndex(tileIndex);
            const testDist = getDistanceToFrom(currTileXY, avgLocation);
            if (testDist > safeTileObj.distance) {
                const isSafe =
                    // TO-DO: ensure below lines are correct...
                    !this.tiles[tileIndex.i][tileIndex.j].getIsDmgTile(teamIndex) // dmg tile status
                    &&
                    !otherTeamsTilesLookup[`${tileIndex.i} ${tileIndex.j}`] // enemy tile, will cause dmg  

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

    getGridLookupVals() {
        const tileIndices = this.getTilesInFlatArray().map(({ tileIndex }) => tileIndex)
        return tileIndices;
    }

    getLookupVals() {
        if (this.bounds == Bounds.Grid) {
            const gridVals = this.getGridLookupVals()
            return gridVals;
        } else if (this.boundsLookup == PENINSULA_TILE_LOOKUP) {
            return PENINSULA_TILE_LOOKUP_VALS;
        } else {
            const tileIndices = Object.values(this.boundsLookup);
            return tileIndices
        }
    }

    getMoveOntoGameBoardMovementData = () => {
        // TO-DO: make this not hard-coded...
        const min_X = 0;
        const min_Y = 30;
        const max_X = 490;
        const max_Y = 800;
        // - - - - - - - - 

        const randIntX = getRandomIntInRange({ min: min_X, max: max_X });
        const randIntY = getRandomIntInRange({ min: min_Y, max: max_Y });

        const charLocation = Math.random() > 0.5 ? { x: randIntX, y: min_Y } : { x: Math.random() > 0.5 ? min_X : max_X, y: randIntY };
        const tileIndex = this.getClosestPerimeterTileFromLocation(charLocation);
        const destXY = this.getTileXAndYFromTileIndex(tileIndex);
        const dir = this.getDirFromNormVec(getNormVecFromDestAndOrigin(destXY, charLocation));

        return {
            charLocation,
            tileIndex,
            dir
        };
    }

    getClosestPerimeterTileFromLocation(location) {
        let closest = { distance: Number.MAX_SAFE_INTEGER, tile: PERIMETER_TILES_VALS[0] };
        PERIMETER_TILES_VALS.forEach(({ i, j }) => {
            const distance = getDistanceToFrom(this.getCharXAndYFromTileIndex({ i, j }), location);
            if (closest.distance > distance) closest = { distance, tile: { i, j } };
        });
        return closest.tile;
    };

    getRandomTileIndexOnBoard = () => {
        if (this.bounds == Bounds.Grid) {
            return {
                i: getRandomIntInRange({ max: this.numTileColumns }),
                j: getRandomIntInRange({ max: this.numTileRows })
            };
        } else {
            const tileIndices = this.tilesLookupVals;//this.getLookupVals(); // eg. [{ i: 0, j: 0 }, ...]
            const randomInt = getRandomIntInRange({ max: tileIndices.length - 1 });
            return tileIndices[randomInt];
        }
    };

    getPathToSafeTile = (pieceIndex) => {
        const safeTileIndex = this.getSafeTileIndex(pieceIndex);
        const tileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);
        const path = this.findPathFromTo(tileIndex, safeTileIndex);
        return path;  // aka: 'moveToTiles'
    }

    getPathToSafeTileAndAvoidEnemies = (pieceIndex) => {
        const safeTileIndex = this.getSafeTileIndex(pieceIndex);
        const tileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);
        const otherTeamsPieces = this.gameManagerProxy.getOtherTeamsPieces(pieceIndex);
        const path = this.findPathFromTo(tileIndex, safeTileIndex, /* ...and avoid: */ otherTeamsPieces.map(({ tileIndex }) => tileIndex));
        return path;  // aka: 'moveToTiles'
    }

    getIsPieceInDanger = (pieceIndex) => {
        const otherTeamsTilesLookup = this.gameManagerProxy.getOtherTeamsPieces(pieceIndex).reduce((acc, { tileIndex }) => {
            acc[`${tileIndex.i} ${tileIndex.j}`] = tileIndex;
            return acc;
        }, {});

        const tileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);
        const teamIndex = this.gameManagerProxy.getPieceTeamIndex(pieceIndex);

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
                        && this.tiles[t.i][t.j].getDmgAmt() > 0
                    ) // enemy status tile, will cause dmg
                    ||
                    !!otherTeamsTilesLookup[`${t.i} ${t.j}`] // enemy tile, will cause dmg  
            );
        return isInDanger;
    }

    getDmg = (pieceIndex) => {
        const tileIndex = this.gameManagerProxy.getPieceTileIndex(pieceIndex);
        const teamIndex = this.gameManagerProxy.getPieceTeamIndex(pieceIndex);
        const tile = this.tiles[tileIndex.i][tileIndex.j];
        const isDmg = tile.getIsDmgTile(teamIndex);
        return isDmg ? tile.getDmgAmt() : 0;
    }

    getTileOffsetFromDir = (dir, tileIndex) => {
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

    getDirFromTiles = (currTileIndex, nextTileIndex) => {
        const areAdjacent = this.getAreTilesAdjacent(currTileIndex, nextTileIndex);

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
            const normVec = this.getNormVecFromTileIndices({ fromTileIndex: currTileIndex, toTileIndex: nextTileIndex });
            const dir = this.getDirFromNormVec(normVec);
            return dir;
        }

    };

    getNormVecFromTileIndices({ fromTileIndex, toTileIndex }) {
        const originXY = this.getTileXAndYFromTileIndex(fromTileIndex);
        const destXY = this.getTileXAndYFromTileIndex(toTileIndex);
        const normVec = getNormVecFromDestAndOrigin(destXY, originXY);
        return normVec;
    }

    getDirFromNormVec(normVec) {
        const xDir = normVec.x > 0 ? "Right" : "Left"; // go right
        const yDir = normVec.y > 0 ? "down" : "up"; // go up
        return `${yDir}${xDir}`;
    }

    getAdjacentTilesFromNormVec(currTile, normVec, area) {
        const directionMapping = [
            { x: 0, y: -1 },
            { x: 0.868, y: -0.496 },
            { x: 0.868, y: 0.496 },
            { x: 0, y: 1 },
            { x: -0.868, y: 0.496 },
            { x: -0.868, y: -0.496 }
        ];
        const tileIndexMapping = [
            { i: 0, j: -1 }, // up
            { i: 1, j: currTile.i % 2 ? 0 : -1 }, // up right
            { i: 1, j: currTile.i % 2 ? 1 : 0 }, // down right
            { i: 0, j: 1 }, // down
            { i: -1, j: currTile.i % 2 ? 1 : 0 }, // down left
            { i: -1, j: currTile.i % 2 ? 0 : -1 } // up left
        ];
        const coords = directionMapping[0];
        // const dot = Math.MIN_SAFE_INTEGER;
        const distance = Math.MAX_SAFE_INTEGER;
        const closest = directionMapping.reduce(
            (acc, item, i) => {
                const distance = getDistanceToFrom(item, normVec);

                // const dot = getDotProduct(item, normVec);
                if (
                    distance < acc.distance 

                    // dot >= acc.dot // TO-DO: TEST!
                    && this.getIsInBounds({
                        i: currTile.i + tileIndexMapping[i].i,
                        j: currTile.j + tileIndexMapping[i].j
                    })) {
                    return { i, coords: item, /*dot*/ distance }
                } else {
                    return acc;
                }
            },
            { i: 0, coords, /*dot*/ distance }
        );
        const tileDirMapping = [
            "up",
            "up right",
            "down right",
            "down",
            "down left",
            "up left"
        ];
        const i = closest.i;
        let spawnPowerTileIndex = {
            i: currTile.i + tileIndexMapping[i].i,
            j: currTile.j + tileIndexMapping[i].j
        };
        if (area >= 6) {
            return [spawnPowerTileIndex, tileDirMapping];
        } else if (area) {
            const dirs = [tileDirMapping[i]];
            for (let k = 1; k < area - 1; k++) {
                const l = i - k < 0 ? 6 - i - k : i - k;
                const m = i + k > 5 ? -1 * (6 - k - i) : i + k;
                dirs.push(tileDirMapping[l]);
                dirs.push(tileDirMapping[m]);
            }
            return [spawnPowerTileIndex, dirs];
        } else {
            return [spawnPowerTileIndex, []];
        }
    };
}