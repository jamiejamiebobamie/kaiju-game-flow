export class GameBoardPieceBase {
    constructor({
        pieceIndex = 0,
        teamIndex = 0,
        avatar = 'guy',
        color = "#55AAff",
        maxLives = 4,
        moveSpeed = 7,
        spriteSheetSrc = '',
        deadSpriteSrc = '',
        isVisible = true,
        isTeamLeader = false,
        isNpc = true,
        isDoAvoidEnemy = true,
        gameManagerProxy,
        abilities = [],
        isOnTiles = true
    }) {

        this.gameManagerProxy = gameManagerProxy;

        this.pieceIndex = pieceIndex;
        this.teamIndex = teamIndex;
        this.isTeamLeader = isTeamLeader;
        this.isNpc = isNpc;
        this.isCharmed = false;

        // aesthetics
        this.avatar = avatar; // enum?
        this.color = color;
        this.isVisible = isVisible;

        // piece class
        this.pieceClass = '';
        this.pieceClassDescription = '';
        this.elements = '';

        // active abilities
        this.abilities = abilities;
        this.abilityAccTimeInterval = 500; // amt of time in milliseconds to wait between ability usages

        // passive abilities
        this.storedPassive = undefined; // teleport passive is called after teleport
        this.livesModifier = 0;
        this.moveSpeedModifier = 0;
        this.numTilesModifier = 0;
        this.tileCountModifier = 0;
        this.dmgModifier = 0;

        // for rendering dmg/healing and teleport floating text
        this.isHealed = false;
        this.isTeleported = false;

        // animation
        this.dir = 'idle';
        this.spriteSheetSrc = spriteSheetSrc;
        this.deadSpriteSrc = deadSpriteSrc;

        // health
        this.lives = maxLives;
        this.maxLives = maxLives;
        this.isDead = false;
        this.lastDmgAccTime = 0; // in milliseconds
        this.lastDmgAccTimeInterval = 1000; // in milliseconds
        this.isShowHealthBarOnComponent = false;

        // movement
        this.shouldTeleport = false;
        this.isThere = true; // tracks if piece is at the next tile in moveToTiles array
        this.moveSpeed = moveSpeed;
        this.isOnTiles = isOnTiles;
        this.charLocation = { x: 0, y: 0 };
        this.moveFromLocation = { x: 0, y: 0 };
        this.moveToLocation = { x: 0, y: 0 };
        this.moveToTiles = [];
        this.tileIndex = { i: 0, j: 0 };
        this.followDistance = 3 + pieceIndex * 2; // in number of tiles
        this.isDoAvoidEnemy = isDoAvoidEnemy; // does NPC pathing avoid enemies

        /*
            Biases the piece to be closer (negative value) or farther away (positive value) from enemy
        */
        this.enemyDistanceBias = 5; // in number of tiles.
    }

    getIsMoveToTiles() {
        return !!this.moveToTiles.length;
    }

    getZIndex() {
        return this.gameManagerProxy.getFlattenedArrayIndex(this.tileIndex);
    }

    initCharLocation(isOnTiles = false) {
        this.isOnTiles = isOnTiles;
        if (isOnTiles) {
            const tileIndex = this.gameManagerProxy.getRandomTileIndexOnBoard();
            const charLocation = this.gameManagerProxy.getCharXAndYFromTileIndex(tileIndex);
            this.charLocation = charLocation;
            this.moveFromLocation = charLocation;
            this.moveToLocation = charLocation;
            this.moveToTiles = [];
            this.isThere = true;
            this.tileIndex = tileIndex;
            this.dir = 'idle';
        } else {
            const { charLocation, tileIndex, dir } = this.gameManagerProxy.getMoveOntoGameBoardMovementData();
            this.charLocation = charLocation;
            this.moveFromLocation = charLocation;
            this.moveToLocation = this.gameManagerProxy.getCharXAndYFromTileIndex(tileIndex);
            this.moveToTiles = [tileIndex];
            this.isThere = false;
            this.tileIndex = tileIndex;
            this.dir = dir;
        }
    }

    getTileIndex() {
        return this.tileIndex;
    }

    getPieceIndex() {
        return this.pieceIndex;
    }

    getLives() {
        return this.lives;
    }

    setAbilities(abilities) {
        this.abilities = abilities;
    }

    setIsTeamLeader(isTeamLeader) {
        this.isTeamLeader = isTeamLeader;
    }

    movePiece({ accTime, timeoutHandler, playerInputHandler }) {
        if (this.isDead) return;

        // intention: even the player can be Charmed and lose control for a moment of his piece....
        if (this.isNpc && this.isOnTiles) {

            const enemy = this.gameManagerProxy.getClosestEnemy(this.pieceIndex);

            // DETERMINE DESIRED MOVEMENT LOGIC
            if (!enemy) {
                this.followLeader();
            } else {
                this.moveWithEnemy(enemy);
            } // - - - - - - - - - - - -

            this.useAbilities(accTime, timeoutHandler);
        } else if (!this.isNpc) {
            // TO-DO: re-implement move with WASD... movement is slowed until player presses another key and releases it while moving in desired direction
            this.handlePlayerInput(playerInputHandler);
        }

        // TO-DO: ensure 'this.shouldTeleport' is only true 
        // for the player if they have 'moveToTiles'.length
        if (this.shouldTeleport) {
            this.teleportPiece();
        }

        // MOVE PIECE
        this.move();

        if (this.isThere) {
            if (this.getIsMoveToTiles()) {
                this.getNextDestination();
            } else if (!this.getIsMoveToTiles()) {
                this.stopMoving();
            }
        }

        // includes Kaiju tiles and dmg status tiles (includes 'Heals', ie. negative dmg)
        const dmg = this.gameManagerProxy.getDmg(this.pieceIndex)
        if (!!dmg) {
            this.decrementHealth(accTime, dmg);
        }
    }

    getMoveToTiles() {
        return this.moveToTiles;
    }

    getNextDestination() {
        const [nextTileIndex, ...tileIndices] = this.moveToTiles;
        const playerDirection = this.gameManagerProxy.getDirFromTiles(this.tileIndex, nextTileIndex);
        this.dir = playerDirection;
        // this.isThere = false;
        this.tileIndex = nextTileIndex;
        this.moveToTiles = tileIndices;
        this.moveToLocation = this.gameManagerProxy.getCharXAndYFromTileIndex(nextTileIndex);
    }

    move() {
        const { newLocation, hasArrived } = this.gameManagerProxy.moveTo({
            currentLocation: this.charLocation,
            moveFromLocation: this.moveFromLocation,
            moveToLocation: this.moveToLocation,
            moveSpeed: this.moveSpeed + this.moveSpeedModifier
        });
        this.charLocation = newLocation;
        this.moveFromLocation = newLocation;
        this.isThere = hasArrived;
    }

    handlePlayerInput(playerInputHandler) {

        /*
            player ended input.
            wait for 'isThere' to be true; character is fully moved to the next tile.
            stop moving.
         */
        if (this.isThere && playerInputHandler.getIsPastPlayerInput() && !playerInputHandler.getIsCurrentPlayerInput()) {
            playerInputHandler.setIsPastPlayerInput(false);
            this.stopMoving();
        } else if (

            playerInputHandler.getIsCurrentPlayerInput()
            && (
                !playerInputHandler.getIsPastPlayerInput()
                ||
                playerInputHandler.getIsChangeOfDirection(this.dir, this.tileIndex)
            )

        ) {

            playerInputHandler.setIsPastPlayerInput(true);

            const moveToTiles = [];
            let tileIndex, wasdDir;

            // start path at current tile   
            tileIndex = this.tileIndex;

            // direction for tile offset used in pathing
            wasdDir = playerInputHandler.getDirFromPlayerInput(tileIndex);

            let desiredOffset = this.gameManagerProxy.getTileOffsetFromDir(wasdDir, tileIndex);
            let nextTileIndex = { i: tileIndex.i + desiredOffset.i, j: tileIndex.j + desiredOffset.j };
            let isValid = this.gameManagerProxy.getIsInBounds(nextTileIndex);
            if (isValid) {
                moveToTiles.push(nextTileIndex);
                while (isValid) {
                    const lastTileIndex = moveToTiles[moveToTiles.length - 1];
                    desiredOffset = this.gameManagerProxy.getTileOffsetFromDir(wasdDir, lastTileIndex);
                    nextTileIndex = { i: lastTileIndex.i + desiredOffset.i, j: lastTileIndex.j + desiredOffset.j };
                    isValid = this.gameManagerProxy.getIsInBounds(nextTileIndex);
                    // console.log({ moveToTiles, isValid, nextTileIndex, desiredOffset, lastTileIndex });
                    if (isValid) {
                        moveToTiles.push(nextTileIndex);
                    }
                }
                this.gameManagerProxy.clearClickedTileIndex();
                /*
                 (1) set new movement path from WASD-arrow_key input
                 (2) and update animation direction
                */
                this.updateMovmement(moveToTiles);

                // console.log({
                //     bool: (
                //         playerInputHandler.getIsCurrentPlayerInput()
                //         && (
                //             !playerInputHandler.getIsPastPlayerInput()
                //             ||
                //             playerInputHandler.getIsChangeOfDirection(this.dir, this.tileIndex)
                //         )
                //     ),
                //     getIsCurrentPlayerInput: playerInputHandler.getIsCurrentPlayerInput(),
                //     partialBool: (!playerInputHandler.getIsPastPlayerInput() || playerInputHandler.getIsChangeOfDirection(this.dir, this.tileIndex)),
                //     getIsPastPlayerInput: playerInputHandler.getIsPastPlayerInput(),
                //     getIsChangeOfDirection: playerInputHandler.getIsChangeOfDirection(this.dir, this.tileIndex),
                //     wasdDir,
                //     tileIndex,
                //     playerInputHandler,
                //     moveToTiles,
                //     desiredOffset,
                //     nextTileIndex,
                //     isValid
                // });

            } else {
                // no valid tile
                this.stopMoving();
            }
        }
    }

    updateMovmement(moveToTiles) {
        if (!moveToTiles || !moveToTiles.length) return;
        this.moveToLocation = this.gameManagerProxy.getCharXAndYFromTileIndex(moveToTiles[0]) || this.moveToLocation;
        this.moveFromLocation = this.charLocation;
        this.moveToTiles = moveToTiles;
        this.isThere = false;

        const playerDirection = this.gameManagerProxy.getDirFromTiles(this.tileIndex, moveToTiles[0]);
        this.dir = playerDirection;
    }

    teleportPiece() {
        // updates useEffect to trigger floating text 'Zip!'
        this.isTeleported = !this.isTeleported;

        const teleportTileIndex = this.isNpc ? this.gameManagerProxy.getSafeTileIndex(this.pieceIndex) : this.moveToTiles[this.moveToTiles.length - 1];

        if (teleportTileIndex) {
            const teleportLocation = this.gameManagerProxy.getCharXAndYFromTileIndex(teleportTileIndex);
            this.tileIndex = teleportTileIndex
            this.charLocation = teleportLocation;
            this.moveToLocation = teleportLocation;
            this.moveFromLocation = teleportLocation;
            this.moveToTiles = [];
            this.isThere = true;

            if (!this.isNpc) {
                this.gameManagerProxy.resetHightlightedTiles();
            }

            // teleport passive is triggered after teleport is triggered...
            if (!!this.storedPassive) this.storedPassive();
        }
    }

    stopMoving() {
        this.dir = 'idle';
        this.moveToLocation = this.charLocation;
        this.moveFromLocation = this.charLocation;
        this.moveToTiles = [];

        if (!this.isOnTiles && this.isThere && !this.moveToTiles.length) {
            this.isOnTiles = true;
        }
    }

    useAbilities(accTime) {
        let hasUsedOneAbility = this.getHasUsedOneAbility(accTime);

        if (hasUsedOneAbility) return;

        const moveToTilesToEnemy = this.gameManagerProxy.getPathToClosestEnemy(this.pieceIndex);
        const numTilesToEnemy = moveToTilesToEnemy.length;
        const isInDanger = this.gameManagerProxy.getIsPieceInDanger(this.pieceIndex);
        const isHealRequired = this.gameManagerProxy.getIsTeamDamaged(this.pieceIndex);

        // use abilities
        this.abilities.forEach(a => {
            if (!hasUsedOneAbility && !a.isOnCooldown) {
                const type = a.getType();
                const desiredAIRange = a.getDesiredAIRange();
                const isOffensivePowerAndTargetInRange =
                    type.includes("offensive") &&
                    !!numTilesToEnemy &&
                    desiredAIRange >= numTilesToEnemy;
                const isDefensivePowerAndIsInDanger =
                    type.includes("defensive") && isInDanger;
                const isEscapePowerAndIsInDanger =
                    type.includes("escape") &&
                    (
                        (!!numTilesToEnemy && desiredAIRange > numTilesToEnemy)
                        || isInDanger
                    );
                const isHealPowerAndIsTeammateHealthLow =
                    type.includes("heal") && isHealRequired;

                if (
                    isOffensivePowerAndTargetInRange ||
                    isDefensivePowerAndIsInDanger ||
                    isEscapePowerAndIsInDanger ||
                    isHealPowerAndIsTeammateHealthLow
                ) {

                    hasUsedOneAbility = true;

                    this.storedPassive = a.useAbility({
                        accTime,
                        piece: this,
                        registerTimeout: this.gameManagerProxy.registerTimeout,
                        updateTileWithAbilityStatus: this.gameManagerProxy.updateTileWithAbilityStatus
                    });
                }
            }
        });
    }

    getHasUsedOneAbility(accTime) {
        return this.abilities.some(v => (accTime - v.accTime) < this.abilityAccTimeInterval);
    }

    moveWithEnemy(enemy) {
        const idealDistance = this.getIdealDistanceFromEnemy();
        const moveToTilesToEnemy = this.gameManagerProxy.getPathFromTileToTile({ fromTile: this.tileIndex, toTile: enemy.tileIndex });

        const isEnemyTooFar = moveToTilesToEnemy.length > idealDistance + this.enemyDistanceBias;
        const isEnemyTooClose = moveToTilesToEnemy.length < idealDistance;

        if (isEnemyTooFar) {
            // move closer to enemy
            this.setMoveToTilesGivenIdealDistanceFromEnemy(moveToTilesToEnemy, idealDistance);
        } else if (isEnemyTooClose) {
            // move closer to safe tile, away from enemy
            const moveToTilesToSafety = this.isDoAvoidEnemy ?
                this.gameManagerProxy.getPathToSafeTileAndAvoidEnemies(this.pieceIndex)
                : this.gameManagerProxy.getPathToSafeTile(this.pieceIndex);
            this.setMoveToTilesGivenIdealDistanceFromEnemy(moveToTilesToSafety, idealDistance);
        }
    }

    setMoveToTilesGivenIdealDistanceFromEnemy(moveToTiles, idealDistance) {
        this.moveToTiles = (moveToTiles.length - idealDistance) > 0 ? moveToTiles.slice(0, moveToTiles.length - idealDistance) : moveToTiles;
    }

    followLeader() {
        const moveToTiles = this.gameManagerProxy.getPathToTeamLeader(this.pieceIndex);
        this.moveToTiles = moveToTiles.length > this.followDistance ?
            // ensure piece follows within the range of 'this.followDistance'
            moveToTiles.slice(0, moveToTiles.length - this.followDistance)
            : [];
    }

    getIdealDistanceFromEnemy() {
        return !this.abilities.length || !this.abilities.some(({ isOnCooldown }) => !isOnCooldown) ?
            10 // default to 10 tiles (away from enemy) if all abilities are on cooldown
            : this.abilities
                .filter(({ isOnCooldown }) => !isOnCooldown)
                .reduce((acc, item) => acc + item.getDesiredAIRange(), 0) / this.abilities.length;
    }

    decrementHealth(accTime, dmg) {
        if (this.getIsDamageable(accTime)) {
            this.setLastDmgAccTime(accTime);

            const isHeal = dmg < 0;
            const isExtraLives = this.livesModifier > 0;
            let remainingDmg = 0;

            if (!isHeal && isExtraLives) {
                remainingDmg = this.decrementExtraLives(dmg);
            }

            const livesNewVal = this.lives - remainingDmg;
            // constrain health to [0, this.maxLives]
            this.lives = Math.max(Math.min(this.maxLives, livesNewVal), 0);

            if (isHeal) {
                // triggers useEffect to show 
                this.isHealed = !this.isHealed;
            }

            const lives = this.lives + this.livesModifier;

            if (!this.isDead && lives < 1) {
                this.handleDeath();
            }
        }
    }

    decrementExtraLives(dmg) {
        /*
            decrement from extra lives (positive "livesModifier")
                before decrementing from health ("lives")
        */
        const remainingDmg = Math.max(dmg - this.livesModifier, 0);
        this.livesModifier = remainingDmg < 0 ? remainingDmg * -1 : 0;

        /*
            ISSUE1: below code only works if dmg clears ALL livesModifier.
                if passive adds +2 livesModifier (for example) and dmg removes -1 livesModifier
                clearing the timeout to remove the modifier will end-up adding permanent health
                
            ISSUE2: TimeoutHandler class needs to handle all timeout logic
        */

        // ability gives: positive "livesModifier." clearTimeout as passive has been toggled-off by decrementing extra lives
        const toggledOnPassives = this.abilities.filter(({ fieldToModify, modifierVal, isPassiveApplied }) => fieldToModify == 'livesModifier' && modifierVal > 0 && !!isPassiveApplied);
        toggledOnPassives.forEach(({ clearPassiveTimeout }) => clearPassiveTimeout());

        return remainingDmg;
    }

    setLastDmgAccTime(accTime) {
        this.lastDmgAccTime = accTime;
    }

    getIsDamageable(accTime) {
        // piece is dead. piece CANNOT be dmged
        if (this.isDead) return false;
        // piece never dmged. piece CAN be dmged
        if (this.lastDmgAccTime == 0) return true;

        // wait until the current game time is greater than the last game time the piece was dmged + the wait time interval
        return accTime > (this.lastDmgAccTime + this.lastDmgAccTimeInterval)
    }

    getNumMoveToTiles() {
        return this.moveToTiles.length;
    }

    getTeamIndex() { return this.teamIndex; }


    // intended for 'Charm' ability - 
    setTeamIndex(index) { this.teamIndex = index; }
    setColor(color) { this.color = color; }
    // - - - - - - - - - - - - - - - -

    getColor() {
        return this.color;
    }

    handleDeath() {
        this.setIsDead();
        this.spawnDeathPiece();
        if (!this.isCharmed) { // TO-DO: think about this...
            this.gameManagerProxy.updateScore(this.teamIndex);
        }
    }

    spawnDeathPiece() {
        this.isVisible = false;
        /*
            pieceAdded to the board on piece's death.
            representation varies per piece.
            (example: 'Exploding Kaiju' sprite anim.)
        */
        this.gameManagerProxy.spawnDeathPieceAtLocation(this.charLocation, this.avatar, this.tileIndex, this.color);
    }

    getIsDead() {
        return this.isDead;
    }

    setIsDead(isDead) {
        this.isDead = isDead;
    }

    respawn(accTime) {
        this.lives = this.maxLives;
        this.isDead = false;
        // TO-DO: remove dead game piece
        this.isVisible = true;

        // reset passive ability stats
        this.storedPassive = undefined;
        this.livesModifier = 0;
        this.moveSpeedModifier = 0;
        this.numTilesModifier = 0;
        this.tileCountModifier = 0;
        this.dmgModifier = 0;
        // - - - - - - - - - - 

        // reset active ability data
        this.lastDmgAccTime = accTime;
        this.shouldTeleport = false;
    }
}