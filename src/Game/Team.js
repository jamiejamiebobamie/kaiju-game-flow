export class Team {
    constructor({ teamLeaderIndex = 0, teamIndex=0, teammateIndices = [] }) {
        this.teamIndex = teamIndex;
        this.teamLeaderIndex = teamLeaderIndex;
        this.teammateIndices = teammateIndices;
    }

    addTeammate(pieceIndex) {
        // add, if not present.
        if (!this.teammateIndices.some(i => i == pieceIndex))
            this.teammateIndices.push(pieceIndex);
    }

    removeTeammate(pieceIndex) {
        // remove, if present.
        if (this.teammateIndices.some(i => i == pieceIndex))
            this.teammateIndices = this.teammateIndices.filter(i => i != pieceIndex);
    }

    changeTeamLeader(pieceIndex) {
        // new teamleader is not on team roster. add teamleader
        if (!this.teammateIndices.some(i => i == pieceIndex))
            this.teammateIndices.push(pieceIndex);
        this.teamLeaderIndex = pieceIndex;
    }

    getTeamLeaderIndex(){
        return this.teamLeaderIndex;
    }

    getTeamPiecesIndices(){
        return this.teammateIndices;
    }
}