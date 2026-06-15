export class GameManagerProxy {
    constructor(props) {
        this.props = props;
    }

    // Call this when the game inits and when the Bounds change
    updateProps(props) {
        this.props = props;
    }

    getDmg(pieceIndex) {
        return this.props.getDmg(pieceIndex);
    }

    determineKaijuDetailsFromDifficulty() {
        return this.props.determineKaijuDetailsFromDifficulty();
    }

    getPathToClosestEnemy(pieceIndex) {
        return this.props.getPathToClosestEnemy(pieceIndex);
    }

    getClosestEnemy(pieceIndex) {
        return this.props.getClosestEnemy(pieceIndex);
    }

    getCharXAndYFromTileIndex(tileIndex) {
        return this.props.getCharXAndYFromTileIndex(tileIndex);
    }

    moveTo({
        currentLocation,
        moveFromLocation,
        moveToLocation,
        moveSpeed
    }) {
        const { newLocation, hasArrived } = this.props.moveTo(
            currentLocation,
            moveFromLocation,
            moveToLocation,
            moveSpeed
        );
        return { newLocation, hasArrived };
    }

    getTileOffsetFromDir(dir, tileIndex) {
        return this.props.getTileOffsetFromDir(dir, tileIndex);
    }

    getIsInBounds(tileIndex) {
        return this.props.getIsInBounds(tileIndex);
    }

    getSafeTileIndex(pieceIndex) {
        return this.props.getSafeTileIndex(pieceIndex);
    }

    resetHightlightedTiles() {
        return this.props.resetHightlightedTiles();
    }

    getIsPieceInDanger(pieceIndex) {
        return this.props.getIsPieceInDanger(pieceIndex);
    }

    getIsTeamDamaged(pieceIndex) {
        return this.props.getIsTeamDamaged(pieceIndex);
    }

    getPathToSafeTileAndAvoidEnemies(pieceIndex) {
        return this.props.getPathToSafeTileAndAvoidEnemies(pieceIndex);
    }

    getPathToSafeTile(pieceIndex) {
        return this.props.getPathToSafeTile(pieceIndex);
    }

    getPathToTeamLeader(pieceIndex) {
        return this.props.getPathToTeamLeader(pieceIndex);
    }

    spawnDeathPieceAtLocation(charLocation, avatar, tileIndex, color) {
        return this.props.spawnDeathPieceAtLocation(charLocation, avatar, tileIndex, color);
    }

    getDirFromTiles(fromTile, toTile) {
        return this.props.getDirFromTiles(fromTile, toTile)
    }

    registerTimeout(accTime, callback, delay) {
        const timeoutRef = this.props.registerTimeout(accTime, callback, delay);
        return timeoutRef;
    }

    unregisterTimeout(timeoutRef) {
        this.props.unregisterTimeout(timeoutRef);
    }

    shootPower({
        pieceIndex,
        range,
        area,
        appliedStatus
    }) {
        this.props.shootPower({
            pieceIndex,
            range,
            area,
            appliedStatus
        });
    }

    updateScore(teamIndex){
        this.props.updateScore(teamIndex);
    }
}